import { Image } from "react-native";

export function HeaderLogo(){
    return (
        <Image 
            source={require('../images/LinguRemiLogo.png')}
            style={{
                width: 260,
                height: 140,
                resizeMode:'contain',
            }}
            />
    )
}