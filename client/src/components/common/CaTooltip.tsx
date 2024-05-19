import { Fade, Tooltip, TooltipProps } from "@mui/material";
import { ReactElement, useEffect, useRef, useState } from "react";

interface CaTooltip {
    id : TooltipProps['id'];
    title?: TooltipProps['title'];
    placement?: TooltipProps['placement'];
    children : ReactElement
}

// Note usage : 
// + Nếu truyền title thì bỏ qua useEffect hay nói cách khác là luôn luôn hiện tooltip (ex: hover icon , button , ...)
// + Nếu ko truyền title thì mặc định hiểu là ở trường hợp hiển thị tooltip khi cuối đoạn text ko có dấu ...

export default function CaTooltip({
    children , 
    id ,
    title ,
    placement = 'bottom-start'
} : CaTooltip ) {
    const childrenInnerTooltip = useRef<HTMLElement | null>(null);
    const [disableListener , setDisableListener] = useState(false);

    useEffect(() => {
        if(!title &&
           childrenInnerTooltip.current && 
           childrenInnerTooltip.current.scrollWidth <= childrenInnerTooltip.current.clientWidth
        ){
            setDisableListener(true)
        }
    },[children])

    const customStyleInnerTooltip : React.CSSProperties = {
        fontSize : '16px',
        display: '-webkit-box', /* Để sử dụng thuộc tính line-clamp */
        WebkitBoxOrient: 'vertical', /* Hiển thị dòng theo chiều dọc */
        WebkitLineClamp: 4, /*Chỉ hiển thị tối đa 4 dòng */
        overflow: 'hidden',
        textOverflow: 'ellipsis' /* show ... ở cuối text */
    }

    const titleElement = title || (
        <div style={customStyleInnerTooltip}>
            {children}
        </div>
    )

    return (
        <Tooltip
            id={id}
            ref={childrenInnerTooltip}        
            title={titleElement}
            placement={placement}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            style={{pointerEvents : disableListener ? 'none' : 'auto'}}
        >
            {children}
        </Tooltip>
    )
}
