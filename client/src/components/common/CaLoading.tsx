import { useEffect } from 'react';
import { Oval } from 'react-loader-spinner';

export default function CaLoading() {

    useEffect(() => {
        const loadingElement = document.querySelector('.un_loading');
        const parentElement = loadingElement?.parentElement
        parentElement!.style.position = "relative";

        return () => {
            parentElement!.style.position = "unset";
        }
    },[])

    return (
        <div className='un_loading'>
            <Oval
                height={40}
                width={40}
                color="#4fa94d"
                wrapperStyle={{
                    height : '100%',
                    width : '100%',
                    justifyContent : 'center',
                    alignItems : 'center',
                    position : 'absolute',
                    zIndex : '99',
                }}
                wrapperClass=""
                visible={true}
                ariaLabel='oval-loading'
                secondaryColor="#4fa94d"
                strokeWidth={2}
                strokeWidthSecondary={2}
            />
        </div>
    )
}