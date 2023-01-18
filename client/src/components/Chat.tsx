import { useReducer, useState } from "react"
import { SocketProvider, useSocketConnected, useSocketEmit, useSocketOn } from "./SocketProvider"
type Message={text:string,datetime:number}
function messagesReducer(state:Message[],action:Message):Message[]{
    return [...state,action]
}

function MessagesList({ addMessage, messages }:{messages:Message[],addMessage:(m:Message)=>void}){
    const sortedMessages=[...messages].sort((a,b)=>a.datetime-b.datetime)
    useSocketOn("chat",addMessage)
    return <div>
        {sortedMessages.map(({text,datetime}) => <p key={datetime}>{text} <i>at {datetime}</i></p> )}
    </div>
}
function MessageSendBox({ addMessage }:{addMessage:(m:Message)=>void}){
    const [currentMessage,setCurrentMessage] = useState<string>("")
    const sendMessage = useSocketEmit("chat")
    return <div>
        <textarea value={currentMessage} onChange={e => setCurrentMessage(e.target.value)}></textarea>
        <button onClick={()=>{
            const message={text:currentMessage,datetime: Date.now()}
            addMessage(message)
            sendMessage(message)
            setCurrentMessage("")
        }}>Send</button>
    </div>
}
function ConnectionStatus(){
    const connected = useSocketConnected();
    return <>{connected?"Connected":"disconnected"}</>
}

export function Chat(){
    const [messages,addMessage] = useReducer(messagesReducer,[]);
    return <SocketProvider>
        <ConnectionStatus/>
        <MessagesList messages={messages} addMessage={addMessage}/>
        <MessageSendBox addMessage={addMessage}/>
    </SocketProvider>
}