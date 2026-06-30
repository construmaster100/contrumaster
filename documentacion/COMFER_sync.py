import requests, xlwings as xw, sys, time

ARCHICAD_URL  = "http://localhost:19723"
EXCEL_PATH    = r"C:\Users\USUARIO\Desktop\COMFER\documentacion\V1 Construmaster.xlsm"
PROPERTY_NAME = "C_contructiva"

def ac_request(command, parameters=None):
    payload = {"command": command}
    if parameters: payload["parameters"] = parameters
    try:
        r = requests.post(ARCHICAD_URL, json=payload, timeout=8)
        return r.json()
    except:
        print("ERROR: Archicad no responde. Verifica que esté abierto.")
        sys.exit(1)

def get_selected_element():
    resp = ac_request("API.GetSelectedElements")
    elements = resp.get("result", {}).get("elements", [])
    if not elements:
        print("Selecciona un elemento en Archicad primero.")
        sys.exit(1)
    return elements[0]["elementId"]

def get_property_def():
    resp = ac_request("API.GetPropertyDefinitions", {"propertyType": "UserDefined"})
    for d in resp.get("result", {}).get("propertyDefinitions", []):
        if d.get("name","").strip() == PROPERTY_NAME:
            return d["id"]
    print(f"No se encontró la property {PROPERTY_NAME}")
    sys.exit(1)

def write_property(elem_id, prop_id, value):
    ac_request("API.SetPropertyValuesOfElements", {"propertyValues": [{
        "elementId": elem_id, "propertyId": prop_id,
        "propertyValue": {"propertyValue": {"type": "normalString", "value": value}}
    }]})

def abrir_buscador():
    try:
        app = xw.apps.active or xw.App(visible=True)
    except:
        app = xw.App(visible=True)
    wb = None
    for book in app.books:
        if "construmaster" in book.name.lower():
            wb = book
            break
    if wb is None:
        wb = app.books.open(EXCEL_PATH)
    wb.activate()
    ws = wb.sheets["COMFER"]
    ws.range("E1").value = ""
    app.api.Run(f"'{wb.name}'!BuscarMaterial")
    print("Esperando selección...")
    for _ in range(120):
        time.sleep(0.5)
        valor = ws.range("E1").value
        if valor and str(valor).strip():
            ws.range("E1").value = ""
            return str(valor).strip()
    return None

def main():
    print("COMFER — Sincronizador C_contructiva")
    print("Leyendo elemento seleccionado en Archicad...")
    elem_id = get_selected_element()
    print(f"GUID: {elem_id.get('guid','')}")
    prop_id = get_property_def()
    print("Abriendo buscador...")
    material = abrir_buscador()
    if not material:
        print("Cancelado.")
        sys.exit(0)
    print(f"Escribiendo '{material}' en Archicad...")
    write_property(elem_id, prop_id, material)
    print("Schedule actualizado correctamente.")

if __name__ == "__main__":
    main()
    input("Presiona Enter para cerrar...")