import { Image } from "react-native";

export function HeaderLogo(){
    return (
        <Image 
            source={require('../images/LinguRemiLogo.png')}
            style={{
                width:140,
                height:100,
                resizeMode:'contain',
            }}
            />
    )
}