import { Button, Drawer } from "@mui/material"
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import { useEffect, useState } from "react";
import ReactLogo from '../assets/react.svg'

const CommentSection = (props) => {
    const [open, setOpen] = useState(false);
    const id = props.id;

    const toggleDrawer = (newOpen) => {
      setOpen(newOpen);
    };

  
    return(
        <div>
            <div onClick={() => toggleDrawer(true)} key={id}>
                <InsertCommentIcon fontSize="large"/>
            </div>
            <Drawer open={open} onClose={() => toggleDrawer(false)} anchor='bottom'>
                {props.comments ? (props.comments.map((comment, index) => {
                    return(
                        <div key={index} className="p-4 flex gap-2">
                            <img src={ReactLogo} alt="logo" className="bg-white rounded-full"/> {/* To change to image url*/}
                            <div>
                                <p className="text-sm text-gray-600">{comment.username}</p>
                                <p>{comment.comment_text}</p>
                            </div>
                        </div>
                    )
                })): (<div>No comments yet.</div>)}
            </Drawer>
        </div>
    )
}

export default CommentSection;