
import asyncio
import websockets
import sqlite3 as sq
import re

async def root(websocket, path) -> any:

    # adjust the path
    req = path[1:]
    x = req.split('-')
    min, max = x[0], x[1]

    # SQL req

    con = sq.connect('data.db')
    cur = con.cursor()
    sqlreq = f'SELECT * FROM PEOPLE WHERE id>{min} and id<={max}'
    cur.execute(sqlreq)

    # modify data
    r = cur.fetchall()
    l = [list(i) for i in r]

    for i in range(0, len(l)) :
        x = re.sub('\(', '', l[i][6])
        y = re.sub('\)', '', x)
        l[i][6] = y

        u = f'{l[i][0]}'
        l[i][0] = u
    
    print(f'Requête envoyé pour donnée de {min} à {max}')

    r = [tuple(i) for i in l]

    # send sql data
    string = str(r)
    await websocket.send(string)


start_server = websockets.serve(root, '127.0.0.1', 3000)
print(f'Serveur lancé sur le port 3000')

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()