import { useReducer, useState } from "react"
import { useSocketEmit, useSocketOn } from "./SocketProvider"

type MessagesState={text:string,datetime:number}[]
type MessagesAction={text:string,datetime:number}
function messagesReducer(state:MessagesState,action:MessagesAction):MessagesState{
    return [...state,action]
}

function MessagesList(){
    const [messages,addMessage] = useReducer(messagesReducer,[]);
    const sortedMessages=[...messages].sort((a,b)=>a.datetime-b.datetime)
    useSocketOn("chat",addMessage)
    return <div>
        {sortedMessages.map(({text,datetime}) => <p>{text} <i>at {datetime}</i></p> )}
    </div>
}
function MessageSendBox(){
    const [currentMessage,setCurrentMessage] = useState<string>("")
    const sendMessage = useSocketEmit("chat")
    return <div>
        <textarea value={currentMessage} onChange={e => setCurrentMessage(e.target.value)}></textarea>
        <button onClick={()=>sendMessage({text:currentMessage,datetime: Date.now()})}></button>
    </div>
}

export function Chat(){
    return <div>
        <MessagesList/>
        <MessageSendBox/>
    </div>
}