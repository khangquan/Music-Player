import {
    StyleSheet,
    Text,
    View,
    Image,
    Animated,
    Easing,
    Dimensions,
    ImageBackground,
    ScrollView,
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'

import Slider from '@react-native-community/slider'
import TrackPlayer, {
    Capability,
    Event,
    RepeatMode,
    State,
    usePlaybackState,
    useProgress,
    useTrackPlayerEvents,
} from 'react-native-track-player'

import PlayButton from '../components/PlayButton'
import SongCard from '../components/SongCard'
import SongsData from '../utils/SongsData'

const { width, height } = Dimensions.get('window');

const setUpPlayer = async () => {
    try {
        await TrackPlayer.setupPlayer()
        await TrackPlayer.updateOptions({
            capabilities: [
                Capability.Play,
                Capability.Pause,
                Capability.SkipToNext,
                Capability.SkipToPrevious,
                Capability.Stop,
            ],
        });
        await TrackPlayer.add(SongsData)
    } catch (error) {
        console.log('Setup error: ', error)
    }
}

const MusicPlayer = () => {
    const [songIndex, setSongIndex] = useState(0)
    const [repeatMode, setRepeatMode] = useState('off')
    const [trackTitle, setTrackTitle] = useState();
    const [trackArtist, setTrackArtist] = useState();
    const [trackArtwork, setTrackArtwork] = useState();

    const playBackState = usePlaybackState()
    const progress = useProgress()

    const scrollTop = useRef()

    const spinValue = useRef(new Animated.Value(0)).current
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        setUpPlayer()

        return () => {
            TrackPlayer.destroy()
        }
    }, []);

    const spinDisk = () => {
        if (isPlaying) {
            spinValue.setValue(0)
            Animated.loop(
                Animated.timing(spinValue, {
                    duration: 4000,
                    toValue: 1,
                    easing: Easing.linear,
                    useNativeDriver: true,
                    isInteraction: true
                })
            ).start()
        } else {
            spinValue.stopAnimation()
        }
    }

    useEffect(() => {
        spinDisk()
    }, [isPlaying])

    const spinInterpolate = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })


    useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
        if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
            const track = await TrackPlayer.getTrack(event.nextTrack);
            const { title, artist, artwork } = track
            setTrackTitle(title);
            setTrackArtist(artist);
            setTrackArtwork(artwork);
        }
    });

    const skipSong = async trackIndex => {
        await TrackPlayer.skip(trackIndex)
    }

    const togglePlayBack = async playBackState => {
        const currentTrack = await TrackPlayer.getCurrentTrack();
        let trackObject = await TrackPlayer.getTrack(currentTrack);
        console.log(`Title: ${trackObject.title}`);

        if (currentTrack != null) {
            if (playBackState == State.Paused || playBackState == State.Ready) {
                await TrackPlayer.play();
                setIsPlaying(true)
            } else {
                await TrackPlayer.pause();
                setIsPlaying(false)
            }
        }
    };

    const skipToNext = async () => {
        let trackIndex = await TrackPlayer.getCurrentTrack();
        skipSong(trackIndex + 1)
        setSongIndex(songIndex + 1)
    }

    const skipToPrev = async () => {
        let trackIndex = await TrackPlayer.getCurrentTrack();
        skipSong(trackIndex - 1)
        setSongIndex(songIndex - 1)
    }

    const handleSelectSong = (song) => {
        setSongIndex(song.id - 1)
        skipSong(song.id - 1)
        scrollTop.current?.scrollTo({ y: 0, animated: true })
    }

    const repeatIcon = () => {
        if (repeatMode == 'off') {
            return 'repeat-off';
        }

        if (repeatMode == 'track') {
            return 'repeat-once';
        }

        if (repeatMode == 'repeat') {
            return 'repeat';
        }
    };

    const handleRepeat = () => {
        if (repeatMode == 'off') {
            TrackPlayer.setRepeatMode(RepeatMode.Track);
            setRepeatMode('track');
        }

        if (repeatMode == 'track') {
            TrackPlayer.setRepeatMode(RepeatMode.Queue);
            setRepeatMode('repeat');
        }

        if (repeatMode == 'repeat') {
            TrackPlayer.setRepeatMode(RepeatMode.Off);
            setRepeatMode('off');
        }
    }

    return (
        <View style={styles.container}>

            <ImageBackground
                source={{ uri: SongsData[songIndex].artwork }}
                resizeMode='cover'
                blurRadius={60}
                style={[styles.backgroundImg, StyleSheet.absoluteFillObject]}
            />
            <ScrollView ref={scrollTop}>
                {/* Music Player */}
                <View style={styles.playerStyle}>
                    <Text style={styles.nowPlaying}> Now playing </Text>
                    <Text style={styles.nowPlayingTitle}> {SongsData[songIndex].title} </Text>
                    <Text style={styles.nowPlayingArtist}> {SongsData[songIndex].artist} </Text>

                    <Animated.Image
                        source={{ uri: SongsData[songIndex].artwork }}
                        style={[styles.diskStyle,
                        { transform: [{ rotate: spinInterpolate }] }]}
                        resizeMode={'cover'}
                    />

                </View>

                {/* Seekbar */}
                <View style={{ paddingHorizontal: 20 }}>
                    <Slider
                        value={progress.position}
                        minimumValue={0}
                        maximumValue={progress.duration}
                        minimumTrackTintColor='#ED225D'
                        maximumTrackTintColor="#ffffff"
                        thumbTintColor='#ED225D'
                        onSlidingComplete={async value => {
                            await TrackPlayer.seekTo(value)
                        }}
                    />
                    <View style={styles.duration}>
                        <Text style={styles.durationLabel}>
                            {new Date(progress.position * 1000)
                                .toLocaleTimeString('vi')
                                .substring(3)}
                        </Text>
                        <Text style={styles.durationLabel}>
                            {new Date((progress.duration - progress.position) * 1000)
                                .toLocaleTimeString('vi')
                                .substring(3)}
                        </Text>
                    </View>
                </View>

                {/* Button */}
                <View style={styles.menuButtons}>
                    <PlayButton iconName={`${repeatIcon()}`}
                        onPress={handleRepeat}
                        isActive={repeatMode !== 'off' ? true : false}
                    />
                    <PlayButton iconName={'skip-previous'}
                        onPress={skipToPrev}
                    />
                    <PlayButton
                        onPress={() => togglePlayBack(playBackState)}
                        iconName={playBackState ===
                            State.Playing ? 'pause' : 'play'}
                        isPlayButton
                    />
                    <PlayButton iconName={'skip-next'}
                        onPress={skipToNext}
                    />
                    <PlayButton iconName={'shuffle-variant'} />
                </View>

                {/* Song select */}
                <View style={styles.songSelectWrapper}>
                    {SongsData.map(song => (
                        <SongCard
                            key={song.id}
                            isSelected={trackTitle === song.title ? true : false}
                            image={song.artwork}
                            songName={song.title}
                            songAuthor={song.artist}
                            onSongEdit={() => { }}
                            onSongPress={() => handleSelectSong(song)}
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    backgroundImg: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    topContent: {
        flex: 1,
        paddingTop: 10,
    },

    playerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },

    nowPlaying: {
        color: '#ED225D',
        fontWeight: 'bold'
    },

    nowPlayingTitle: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold'
    },

    nowPlayingArtist: {
        color: 'black',
        fontWeight: 'bold'
    },

    diskStyle: {
        height: 300,
        width: 300,
        marginVertical: 15,
        borderRadius: 999,
    },

    duration: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        alignItems: 'center'
    },

    durationLabel: {
        color: '#ffffff',
    },

    menuButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom: 30,
        paddingTop: 20,
    },

    songSelectWrapper: {
        padding: 15,
    }

})

export default MusicPlayer