<Modal
transparent={true}
animationType="slide"
visible={isSevenModalVisible}
onRequestClose={toggleSevenModal}
>
<TouchableWithoutFeedback
// onPress={startStopRecording}
>

  <View style={styles.modalOverlay3}>

    <ImageBackground
      style={{
        width: wp('99%'),
        alignItems: 'center',
        borderRadius: 10,
        justifyContent: 'center',
        resizeMode: 'center',
        overflow: 'hidden', // Clip the content to the borderRadius
      }}
      source={images.BG}
    >
      <View style={{ alignItems: 'center', justifyContent: 'center', width: '80%', margin: 10, }}>
        <View
          style={{
            borderWidth: 5, borderRadius: 10,
            alignItems: 'center', borderColor: '#ffffff', width: '40%', height: '1%',
          }}>
        </View>
      </View>

      <View
        style={
          {
            alignItems: 'center', flexDirection: 'row', width: '80%', marginTop: 20, backgroundColor: '#ffffff',
            borderWidth: 1, borderRadius: 10
          }
        }
      >
        {recordingData &&
          recordingData.map(item => {
            return (
              <TouchableOpacity
                onPress={() => setSelectedRecording(item.id)}
                key={item.id}
                style={[
                  styles.tabButton,
                  {
                    //  borderBottomWidth: selectedGalary === item.id ? 2 : 0,
                    borderColor: selectedGalary === item.id ? '#000000' : 'transparent',
                    borderRightWidth: 1, // Add this line
                    //  borderRightColor: '#000000', // Add this line if you want a specific color

                  },
                ]}>
                <Image source={item.image} style={{ width: hp('3%'), margin: wp('1%'), height: hp('3%'), resizeMode: 'contain' }} />
                <Text style={[styles.tabButtonTxt, {
                  color:
                    selectedRecording === item.id
                      ? '#000000'
                      : '#000000',
                },]}>{item.name}</Text>
              </TouchableOpacity>
            );
          })}
      </View>

      {selectedRecording == 1 ? (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <TouchableWithoutFeedback onPress={playPauseAudio}>
            <Image source={images.Mike} style={{ resizeMode: 'contain', marginTop: 10 }} />
          </TouchableWithoutFeedback>

          <Image source={images.AudioProgress} style={{ resizeMode: 'contain', marginTop: 10, margin: 10 }} />

          {audioPath && (
            <>
              <Text style={{ color: 'black', fontSize: 18, marginVertical: 10 }}>
                Recording Time: {formatTime(recordingTime)}
              </Text>

              <TouchableOpacity onPress={playPauseAudio} style={{ padding: 20, backgroundColor: 'blue' }}>
                <Text style={{ color: 'white' }}>{isPlaying ? 'Pause' : 'Play'}</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity 
        //  onPress={startStopRecording}
           >
            <Image source={images.Play} style={{ resizeMode: 'contain', marginTop: 10 }} />
          </TouchableOpacity>
          <TouchableOpacity onRequestClose={toggleSevenModal} style={{ padding: hp('1%'), margin: 10, borderRadius: 5, width: '30%', borderWidth: 1, }}>
            <Text style={{ color: 'black', paddingHorizontal: hp('1%'), }}>
              {/* {isRecording ? 'Stop Recording' : 'Start Recording'} */}
              Save</Text>
          </TouchableOpacity>

          {/* {audioPath && (
            <TouchableOpacity onPress={playPauseAudio} style={{ padding: 20, backgroundColor: 'blue' }}>
              <Text style={{ color: 'white' }}>{isPlaying ? 'Pause' : 'Play'}</Text>
            </TouchableOpacity>
          )} */}

        </View>

      )
        :
        <>

          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image source={images.Mike} style={{ resizeMode: 'contain', marginTop: 10 }} />
            <Image source={images.AudioProgress} style={{ resizeMode: 'contain', marginTop: 10, margin: 10 }} />

            {audioPath && (
              <>
                <Text style={{ color: 'black', fontSize: 18, marginVertical: 10 }}>
                  Recording Time: {formatTime(recordingTime)}
                </Text>

                <TouchableOpacity onPress={playPauseAudio} style={{ padding: 20, backgroundColor: 'blue' }}>
                  <Text style={{ color: 'white' }}>{isPlaying ? 'Pause' : 'Play'}</Text>
                </TouchableOpacity>

              </>
            )}

            <Image source={images.Play} style={{ resizeMode: 'contain', marginTop: 10 }} />

            <TouchableOpacity onPress={playPauseAudio} style={{ padding: hp('1%'), margin: 10, borderRadius: 5, width: '30%', borderWidth: 1, }}>
              <Text style={{ color: 'black', paddingHorizontal: hp('1%'), }}>
                {/* {isRecording ? 'Stop Recording' : 'Start Recording'} */}
                Save</Text>
            </TouchableOpacity>

            {/* {audioPath && (
          <TouchableOpacity onPress={playPauseAudio} style={{ padding: 20, backgroundColor: 'blue' }}>
            <Text style={{ color: 'white' }}>{isPlaying ? 'Pause' : 'Play'}</Text>
          </TouchableOpacity>
        )} */}

          </View>
        </>
        //[]
        // <FlatList
        //   data={recordings}
        //   keyExtractor={(item, index) => index.toString()}
        //   renderItem={({ item, index }) => (
        //     <TouchableOpacity
        //       onPress={() => startStopRecording(item)}
        //       style={styles.recordingItem}
        //     >
        //       <Text style={styles.recordingItemText}>{item.name}{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
        //       <TouchableOpacity
        //         //  onPress={recordings ? stopRecording : startRecording}
        //         // onPress={() => playPause()}
        //         style={styles.recordButton}
        //       >
        //         <Image source={images.Mike} />

        //         <TouchableOpacity onPress={startStopRecording} style={{ padding: 20, margin: 10, backgroundColor: 'red' }}>
        //           <Text style={{ color: 'white' }}>{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
        //         </TouchableOpacity>
        //         {audioPath && (
        //           <TouchableOpacity onPress={playPauseAudio} style={{ padding: 20, backgroundColor: 'blue' }}>
        //             <Text style={{ color: 'white' }}>{isPlaying ? 'Pause' : 'Play'}</Text>
        //           </TouchableOpacity>
        //         )}
        //       </TouchableOpacity>
        //     </TouchableOpacity>

        //   )}
        // />
      }
    </ImageBackground>

  </View>
</TouchableWithoutFeedback>
</Modal>