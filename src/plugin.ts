import { Manager, Node, Plugin, Structure } from 'erela.js';
export class nodeDisconnectHandler extends Plugin {
    //@ts-expect-error 
    public manager: Manager

    public load(manager: Manager) {
        this.manager = manager
        if (this.manager.nodes.filter(x => x.connected).size < 1) throw new Error('Lavalink node must more than 1 to use this plugin.');
        this.manager.on('nodeDisconnect', (node, reason) => {
            for (const player of [...this.manager.players.filter(x => x.node === node).values()]) {
                player.moveNode()
            }
        })

        Structure.extend('Player', (Player) => class extends Player {
            async moveNode(node?: string) {
                this.destroy();
                
                let newNode: Node | undefined;
                if (this.node.options.identifier === node) return this;
                if (!node) newNode = this.manager.leastLoadNodes.first();
                newNode = this.manager.nodes.get(node as string);
                if (!newNode?.connected) throw Error('The node is not connected');
                this.node = newNode;
                const playOptions = {
                    op: "play",
                    guildId: this.guild,
                    track: this.queue.current?.track,
                    startTime: this.position,
                };
                await this.node.send(this.voiceState)
                await this.node.send(playOptions);
                return this;
            }
        })
    }
}
 
declare module 'erela.js/structures/Player' {
    export interface Player {
        moveNode(node?: string): Promise<Player>
    }
}