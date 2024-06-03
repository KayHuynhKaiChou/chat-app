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
    //const [disableListener , setDisableListener] = useState(false);

    // func handle logic and change state
    function checkTextExceedWidthLimit(containerText : HTMLElement | null){
        if(containerText){
            const isDisabledEvent = !title && containerText && containerText.scrollWidth <= containerText.clientWidth
            containerText.style.pointerEvents = isDisabledEvent ? 'none' : 'auto'
        }
        //setDisableListener(isDisabledEvent)
    } 

    // use hook
    // when resize window , clientWidth will change , do đó text sẽ có dấu ... ở cuối
    // => cần check lại bằng func checkTextExceedWidthLimit
    useEffect(() => {
        // use debounce để sau khi end resize window mới call func checkTextExceedWidthLimit
        let resizeTimeout = 0;
    
        const handleResize = () => {
            // Clear the timeout as the resize event is still ongoing
            clearTimeout(resizeTimeout);
            
            // Set a timeout to run after 500ms of no resize events
            resizeTimeout = setTimeout(() => {
                // Ko có cách nào để re-render lại component ContactsComponent từ CaTooltip , nên childrenInnerTooltip
                // vẫn keep state cũ khi resize window vì resize ko thể re-render ContactsComponent
                // Solution : Lấy trực tiếp ele children trong tooltip thông qua getElementById khi đang thực hiện resize
                const elementInnerTooltip = document.getElementById(id+'') as HTMLElement
                checkTextExceedWidthLimit(elementInnerTooltip)
            }, 500); // Adjust the delay as needed
        };
    
        window.addEventListener('resize', handleResize);
    
        // Clean up the event listener on unmount
        return () => {
          window.removeEventListener('resize', handleResize);
          clearTimeout(resizeTimeout); // Clean up the timeout if the component unmounts
        };
    }, []);

    useEffect(() => {
        checkTextExceedWidthLimit(childrenInnerTooltip.current)
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
            //style={{pointerEvents : disableListener ? 'none' : 'auto'}}
        >
            {children}
        </Tooltip>
    )
}
