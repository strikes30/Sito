import json
import re
import shutil
import unicodedata
from collections import Counter
from pathlib import Path

PERCORSO = Path(__file__).resolve().parent / "spells.json"

def crea_id(nome: str) -> str:
    nome = unicodedata.normalize("NFD", nome)
    nome = "".join(
        carattere for carattere in nome
        if unicodedata.category(carattere) != "Mn"
    )
    nome = nome.lower().strip()
    nome = re.sub(r"[^a-z0-9]+", "-", nome)
    return nome.strip("-")


with PERCORSO.open("r", encoding="utf-8") as file:
    incantesimi = json.load(file)

if not isinstance(incantesimi, list):
    raise ValueError("Il JSON deve contenere un array di incantesimi.")

ids = [crea_id(incantesimo["name"]) for incantesimo in incantesimi]
duplicati = [
    id_incantesimo
    for id_incantesimo, conteggio in Counter(ids).items()
    if conteggio > 1
]

if duplicati:
    raise ValueError(
        f"ID duplicati, file non modificato: {', '.join(duplicati)}"
    )

for incantesimo, id_incantesimo in zip(incantesimi, ids):
    incantesimo["id"] = id_incantesimo

backup = PERCORSO.with_suffix(".backup.json")
shutil.copy2(PERCORSO, backup)

with PERCORSO.open("w", encoding="utf-8") as file:
    json.dump(incantesimi, file, ensure_ascii=False, indent=2)
    file.write("\n")

print(f"Aggiunti gli ID a {len(incantesimi)} incantesimi.")
print(f"Backup creato: {backup}")