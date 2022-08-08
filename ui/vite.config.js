import { sveltekit } from '@sveltejs/kit/vite';
import { configureServer } from './src/server';

// import { Server } from 'socket.io';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sveltekit(),
		{
			name: 'sveltekit-socket-io',
			configureServer
		}
	]
};

export default config;
