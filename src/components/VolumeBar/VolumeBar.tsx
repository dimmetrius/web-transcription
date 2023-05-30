import { FC } from 'react'

export const VolumeBar: FC<{position: number}> = ({position}) => {
    const containerWidth = 80
    const width = 50
    const height = 25
    const posWidth = width - width * position
    return (
        <div style={{width: width, height: height}}>
          <div style={{
            position: 'absolute',
            width: 0, 
            height: 0, 
            borderStyle: 'solid',
            borderWidth: `0 0 ${height}px ${width}px`,
            borderColor: 'transparent transparent #ffffff transparent'}}></div>
            <div style={{
            position: 'absolute', height: height, width: posWidth, background: '#26ace2', right: (containerWidth - width)/2}} />
        </div>
    )
}