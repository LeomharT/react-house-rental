import { AudioMutedOutlined, AudioOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';
import { MessageType } from './HConsult';

@observer
export default class VoiceMessage extends Component<{ SocketSendVoiceMessage: Function, DisPlayVoiceMessage: Function; }, {}>
{
    @observable recording: boolean = false;
    //@ts-ignore
    @observable mediaRecorder: MediaRecorder;
    GetMicroPhoneAuthority = async (): Promise<void> =>
    {
        const constraints = { audio: true };
        let voice: Blob[] = [];
        try
        {
            let stream = await navigator.mediaDevices.getUserMedia(constraints);
            //@ts-ignore
            this.mediaRecorder = new MediaRecorder(stream);
            //@ts-ignore
            this.mediaRecorder.ondataavailable = (res) =>
            {
                //res里有data和timecode时间戳
                voice.push(res.data);
            };
            this.mediaRecorder.onstop = () =>
            {
                let blob = new Blob(voice, { type: "audio/webm;codecs=opus" });
                let url = window.URL.createObjectURL(blob);
                voice = [];
                this.props.SocketSendVoiceMessage(blob);
                this.props.DisPlayVoiceMessage(url, MessageType.MyMessage);
            };
        } catch (e)
        {
            message.error("请开启麦克风权限!");
        }
    };
    async componentDidMount()
    {
        await this.GetMicroPhoneAuthority();
    }
    render()
    {
        const { recording } = this;
        return (
            <div className='RecordingVoice'>
                {recording && <div className='SoundWave' />}
                {recording && <div className='SoundWaveBorder' />}
                <Button
                    shape='circle'
                    size='large'
                    type='primary'
                    icon={
                        !recording
                            ? <AudioOutlined />
                            : <AudioMutedOutlined />
                    }
                    onClick={() =>
                    {
                        this.recording = !this.recording;
                        if (this.recording)
                        {
                            this.mediaRecorder.start();
                        } else
                        {
                            this.mediaRecorder.stop();
                        }
                    }}
                />
            </div>
        );
    }
}
