import { Skeleton } from "@mui/material";

export default function CaSkeleton() {
  return (
    <div className="bl_caSkeleton">
      {Array(5).fill(null).map(() => (
        <div className="bl_caSkeleton_item">
          <Skeleton 
            animation="wave" 
            variant="circular" 
            width={70} 
            height={70}
          />
          <Skeleton 
            animation="wave" 
            variant="rectangular" 
            width={210} 
            height={70}
          />
        </div>
      ))}
    </div>
  )
}
