import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'

import Icon from 'react-native-vector-icons/Ionicons';

export default function SongCard({ image, songName, songAuthor, onSongPress, onSongEdit, isSelected }) {
    return (
        <View style={[styles.container,
        { opacity: isSelected ? 1 : 0.5 }]}>
            <TouchableOpacity style={styles.song} onPress={onSongPress}>
                <Image source={{ uri: image }}
                    style={styles.songImage}
                    resizeMode='cover'
                />

                <View style={styles.songTitle}>
                    <Text style={styles.songName}>{songName}</Text>
                    <Text style={styles.songAuthor}>{songAuthor}</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ position: 'absolute', right: 10 }} onPress={onSongEdit}>
                <Icon name="ellipsis-horizontal" size={30} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: '#ccc',
        marginBottom: 15,

        // IOS Shadow
        shadowOpacity: 5,
        shadowOffset: { width: 10, height: 10 },
        shadowRadius: 10,
        shadowColor: 'black',

        // ANDROID Shadow
        elevation: 5
    },

    song: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 70,
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },

    songImage: {
        height: 50,
        width: 50,
        borderRadius: 100,
        marginRight: 20,
    },

    songTitle: {
        flex: 1,
        left: 0
    },

    songName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black'
    },

    songAuthor: {

    }
})