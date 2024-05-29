import "./list.css"
import Userinfo from "./userinfo/userinfo"
import Chatlist from "./chatlist/chatlist"
const List = () => {
    return (
      <div className='list'>
        <Userinfo/>
        <Chatlist/>
      </div>
    )
  }
  
  export default List