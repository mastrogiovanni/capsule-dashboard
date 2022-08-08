import { Server } from 'socket.io';
import * as k8s from '@kubernetes/client-node';

/**
 * @param {{ httpServer: Partial<import("socket.io").ServerOptions> | undefined; }} server
 */
export async function configureServer(server) {

    const io = new Server(server.httpServer);
    console.log('SocketIO injected');

    // This is located in the svelte config (see above "Socket.IO stuff goes here")
    io.on('connection', (socket) => {

        console.log("Connected", socket.id)

        // Generate a random username and send it to the client to display it
        let username = `User ${Math.round(Math.random() * 999999)}`;
        socket.emit('name', username);

        // Receive incoming messages and broadcast them
        socket.on('message', (message) => {
            io.emit('message', {
                from: username,
                message: message,
                time: new Date().toLocaleString()
            });
        });
    });

    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    const watch = new k8s.Watch(kc);

    console.log("Starting watch")

    const req = await watch.watch('/apis/capsule.clastix.io/v1beta1/tenants',
        // optional query parameters can go here.
        {
            allowWatchBookmarks: true,
        },
        // callback is called for each received object.
        (type, apiObj, watchObj) => {
            if (type === 'ADDED') {
                // tslint:disable-next-line:no-console
                console.log('new object:');
            } else if (type === 'MODIFIED') {
                // tslint:disable-next-line:no-console
                console.log('changed object:');
            } else if (type === 'DELETED') {
                // tslint:disable-next-line:no-console
                console.log('deleted object:');
            } else if (type === 'BOOKMARK') {
                // tslint:disable-next-line:no-console
                console.log(`bookmark: ${watchObj.metadata.resourceVersion}`);
            } else {
                // tslint:disable-next-line:no-console
                console.log('unknown type: ' + type);
            }
            // tslint:disable-next-line:no-console
            console.log("API POBJ", apiObj, type, watchObj);
        },
        // done callback is called if the watch terminates normally
        (err) => {
            // tslint:disable-next-line:no-console
            console.log(err);
        })

    // watch returns a request object which you can use to abort the watch.
    setTimeout(() => { 
        console.log("Ended watch")
        req.abort(); 
    }, 1000 * 1000);

}
