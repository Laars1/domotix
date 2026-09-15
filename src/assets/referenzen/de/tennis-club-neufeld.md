## Ausgangslage

Für die Tennisplätze bestand bereits eine KNX-basierte
Gebäudeautomation. Die Platzbeleuchtung sollte zusätzlich mit dem
GotCourts-Reservierungssystem verknüpft werden, um den Energieverbrauch
zu reduzieren und unnötige Lichtemissionen für die Umgebung zu
vermeiden.

## Lösung

Loxone wurde als intelligente Schnittstelle zwischen GotCourts und der
bestehenden KNX-Installation integriert. Über die GotCourts-API werden
die aktuellen Reservationen ausgewertet und an die Gebäudeautomation
übergeben. In Kombination mit der Umgebungshelligkeit wird die
Platzbeleuchtung dadurch automatisch und bedarfsgerecht über KNX
gesteuert. Das Licht ist nur dann aktiv, wenn es tatsächlich benötigt
wird.
