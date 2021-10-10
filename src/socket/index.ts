import { Server } from "socket.io"

const frontEndWebsocket = new Server()
frontEndWebsocket.listen(6000)

export default frontEndWebsocket
