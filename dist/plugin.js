"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeDisconnectHandler = void 0;
const erela_js_1 = require("erela.js");
class Player extends erela_js_1.Structure.get('Player') {
    async moveNode(node) {
        if (this.node.options.identifier === node)
            return this;
        if (!node)
            throw Error('You must spesify node identifier.');
        const newNode = this.manager.nodes.get(node);
        if (!newNode?.connected)
            throw Error('The node you spesify is not connected.');
        const playOptions = {
            op: "play",
            guildId: this.guild,
            track: this.queue.current?.track,
            startTime: this.position,
        };
        await newNode.send(this.voiceState);
        await newNode.send(playOptions);
        this.node = newNode;
        return this;
    }
}
class nodeDisconnectHandler extends erela_js_1.Plugin {
    load(manager) {
        this.manager = manager;
        this.manager.on('nodeDisconnect', (node, reason) => {
            if (this.manager.nodes.filter(x => x.connected).size < 1)
                return;
            for (const player of [...this.manager.players.filter(x => x.node === node).values()]) {
                player.moveNode(this.manager.leastLoadNodes.first()?.options.identifier);
            }
        });
        erela_js_1.Structure.extend("Player", () => Player);
    }
}
exports.nodeDisconnectHandler = nodeDisconnectHandler;
//# sourceMappingURL=plugin.js.map