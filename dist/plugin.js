"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeDisconnectHandler = void 0;
const erela_js_1 = require("erela.js");
class nodeDisconnectHandler extends erela_js_1.Plugin {
    load(manager) {
        this.manager = manager;
        if (this.manager.nodes.filter(x => x.connected).size < 1)
            throw new Error('Lavalink node must more than 1 to use this plugin.');
        this.manager.on('nodeDisconnect', (node, reason) => {
            for (const player of [...this.manager.players.filter(x => x.node === node).values()]) {
                player.moveNode();
            }
        });
        erela_js_1.Structure.extend('Player', (Player) => class extends Player {
            async moveNode(node) {
                this.destroy();
                let newNode;
                if (this.node.options.identifier === node)
                    return this;
                if (!node)
                    newNode = this.manager.leastLoadNodes.first();
                newNode = this.manager.nodes.get(node);
                if (!newNode?.connected)
                    throw Error('The node is not connected');
                this.node = newNode;
                const playOptions = {
                    op: "play",
                    guildId: this.guild,
                    track: this.queue.current?.track,
                    startTime: this.position,
                };
                await this.node.send(this.voiceState);
                await this.node.send(playOptions);
                return this;
            }
        });
    }
}
exports.nodeDisconnectHandler = nodeDisconnectHandler;
