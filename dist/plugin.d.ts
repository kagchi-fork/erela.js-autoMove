import { Manager, Plugin } from 'erela.js';
export declare class nodeDisconnectHandler extends Plugin {
    manager: Manager;
    load(manager: Manager): void;
}
declare module 'erela.js/structures/Player' {
    interface Player {
        moveNode(node: string): Promise<Player>;
    }
}
