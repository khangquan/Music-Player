import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default function PlayButton({ isPlayButton, isActive, iconName, onPress }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.buttonStyle,

            isPlayButton ? styles.playButtonStyle : null
            ]}>
            <Icon name={iconName} size={30}
                style={[isActive ? styles.activeButton : { color: 'white' }]}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonStyle: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },

    activeButton: {
        color: '#ED225D',
    },

    playButtonStyle: {
        backgroundColor: '#ED225D',
        height: 70,
        width: 70,
        borderRadius: 100,
    }
})