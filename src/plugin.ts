import { Manager, Plugin, Structure } from 'erela.js';
export class nodeDisconnectHandler extends Plugin {
    //@ts-expect-error 
    public manager: Manager

    public load(manager: Manager) {
        this.manager = manager
        this.manager.on('nodeDisconnect', (node, reason) => {
            if (this.manager.nodes.filter(x => x.connected).size < 1) return;
            for (const player of [...this.manager.players.filter(x => x.node === node).values()]) {
                player.moveNode(this.manager.leastLoadNodes.first()?.options.identifier as string)
            }
        })

        Structure.extend('Player', (Player) => class extends Player {
            async moveNode(node: string) {
                if (this.node.options.identifier === node) return this;
                if (!node) throw Error('You must spesify node identifier.');
                const newNode = this.manager.nodes.get(node as string);
                if (!newNode?.connected) throw Error('The node you spesify is not connected.');
                const playOptions = {
                    op: "play",
                    guildId: this.guild,
                    track: this.queue.current?.track,
                    startTime: this.position,
                };
                await newNode.send(this.voiceState)
                await newNode.send(playOptions);
                this.node = newNode;
                return this;
            }
        })
    }
}
 
declare module 'erela.js/structures/Player' {
    export interface Player {
        moveNode(node: string): Promise<Player>
    }
}