/**
 * @author Semper
 */
import {Animated, Easing} from "react-native";

export const createAnimation = function (value, toValue, duration = 1000, easing = Easing.linear, delay = 0) {
    return Animated.timing(
        value,
        {
            toValue,
            duration,
            easing,
            delay
        }
    )
};
