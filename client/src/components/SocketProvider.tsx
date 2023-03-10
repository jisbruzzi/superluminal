import  { useEffect, PropsWithChildren, createContext, useContext, useState } from 'react';
import io, { Socket } from 'socket.io-client';
interface ServerToClientEvents{
    chat:(arg:{
        text:string,
        datetime:number
    })=>void,
    move:(arg:{
        x:number,
        y:number,
        datetime:number
    })=>void,
    connect: () => void;
    connect_error: (err: Error) => void;
    disconnect: (reason: Socket.DisconnectReason, description?: any) => void;
}
interface ClientToServerEvents{
    chat:(arg:{
        text:string,
        datetime:number
    })=>void,
    move:(arg:{
        direction:"N"|"E"|"S"|"W",
        player:number,
        datetime:number
    })=>void,
}
type CustomSocket=Socket<ServerToClientEvents,ClientToServerEvents>
const SocketContext = createContext<CustomSocket|null>(null)
export function useSocketOn<T extends keyof ServerToClientEvents>(name:T,callback:ServerToClientEvents[T]){
    const socket = useContext(SocketContext)
    useEffect(()=>{
        if(socket!==null){
            socket.on<T>(name, callback as unknown as any);
            return ()=>socket.off(name)
        }
        return ()=>{}
    },[socket])
}

export function useSocketEmit<T extends keyof ClientToServerEvents>(name:T){
    const socket = useContext(SocketContext)
    if(socket){
        return (...args:Parameters<ClientToServerEvents[T]>)=>socket.emit(name,...args)
    }else{
        return (..._args:Parameters<ClientToServerEvents[T]>)=>{}
    }
}

export function useSocketConnected(){
    const socket = useContext(SocketContext)
    const [state,setState]=useState(socket?.connected??false);
    useSocketOn("connect",()=>{
        setState(true)
    })
    useSocketOn("disconnect",()=>{
        setState(false)
    })
    useEffect(()=>{
        setState(socket?.connected??false)
    },[socket])
    return state
}

export function SocketProvider({children}:PropsWithChildren<{}>){
    const socket = io("localhost:4000",{});
    return <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
}
