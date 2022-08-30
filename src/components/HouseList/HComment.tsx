import { CloseSquareOutlined, CommentOutlined, DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined, PictureOutlined, SmileOutlined } from '@ant-design/icons';
import { Avatar, Button, Comment, Divider, Empty, message, Popover, Tooltip } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { Component, createElement, RefObject } from 'react';
import { HouseComment, HouseInfo } from '../../interfaces/HouseListInterface';
import UserStore from '../../redux/UserStore';
import { CONST_HOST } from '../Common/VariableGlobal';
import EmojiList from '../HConsult/EmojiList';
@observer
export default class HComment extends Component<{ houseDetailInfo: HouseInfo; }, {}>
{
    @observable commentList: HouseComment[] = [];
    InitComment = async (parentId: string = '0'): Promise<void> =>
    {
        this.commentList = await (
            (await fetch(`${CONST_HOST}/GetHouseComment?hId=${this.props.houseDetailInfo.baseInfo.hId}&parentId=${parentId}`)).json()
        ) as HouseComment[];
    };
    async componentDidMount()
    {
        await this.InitComment();
    }
    render()
    {
        return (
            <div className='HComment' id='HComment'>
                <CommentInput callBack={this.InitComment} />
                <Divider />
                {this.commentList.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无评论' />}
                {
                    this.commentList.map((c: HouseComment) =>
                    {
                        return (
                            <CommentItem key={c.id} commentItem={c} />
                        );
                    })
                }
            </div>
        );
    }
}
@observer
export class CommentInput extends React.Component<{ commentId?: string, callBack?: Function; }, {}>
{
    UserStore: UserStore = UserStore.GetInstance();
    messageTextArea: RefObject<HTMLTextAreaElement> = React.createRef<HTMLTextAreaElement>();
    fileUploader: RefObject<HTMLInputElement> = React.createRef<HTMLInputElement>();
    @observable imgArray: string[] = [];
    fileList: File[] = [];
    PostImg = (e: React.ChangeEvent<HTMLInputElement>): void =>
    {
        if (!e.target.files) return;
        if (this.fileList.length >= 3)
        {
            message.error("太多图片了哦🤨,干掉一点去😀");
            return;
        }
        this.fileList.push(e.target.files[0]);
        const fileReader = new FileReader();
        fileReader.readAsDataURL(e.target.files[0]);
        fileReader.onload = (e) =>
        {
            this.imgArray.push(e.target?.result?.toString() as string);
        };
        e.target.value = '';
    };
    PostComment = async (parentId: number): Promise<void> =>
    {
        console.log(this.imgArray[0]);
    };
    render()
    {
        return (
            <div className='CommentInput'>
                <Avatar
                    size={46}
                    shape='circle'
                    src={
                        this.UserStore.authInfo.userInfo
                            ? this.UserStore.authInfo.userInfo.photo
                            : 'https://files.authing.co/authing-console/default-user-avatar.png'
                    }
                />
                <div>
                    <textarea ref={this.messageTextArea} rows={4} />
                    <div>
                        <Popover
                            trigger='click'
                            placement='bottomLeft'
                            content={
                                <EmojiList messageInput={this.messageTextArea} />
                            }
                        >
                            <Button
                                type='link'
                                icon={<SmileOutlined />}
                            />
                        </Popover>
                        <Button
                            type='link'
                            icon={<PictureOutlined />}
                            onClick={() =>
                            {
                                this.fileUploader.current!.click();
                            }}
                        />
                    </div>
                    <div className='PostImgs'>
                        {this.imgArray.map((url: string, index: number) =>
                        {
                            return (
                                <div key={index}>
                                    <Button
                                        danger
                                        icon={<CloseSquareOutlined />}
                                        size='middle'
                                        type='link'
                                        onClick={() =>
                                        {
                                            this.imgArray.splice(index, 1);
                                            this.fileList.splice(index, 1);
                                        }}
                                    />
                                    <img alt='图片' src={url} />
                                </div>
                            );
                        })}
                        {Boolean(this.imgArray.length) && <span>
                            {`(${this.imgArray.length}/3)`}
                        </span>}
                    </div>
                    <Button
                        type='primary'
                        icon={<CommentOutlined />}
                        style={{ width: "200px" }}
                        onClick={() =>
                        {
                            this.UserStore.CheckForIsLogin();
                            const parentId = this.props.commentId ?? "0";
                            this.PostComment(parseInt(parentId));
                        }}
                    >发布评论
                    </Button>
                </div>
                <input
                    type='file'
                    style={{ display: "none" }}
                    ref={this.fileUploader}
                    onChange={this.PostImg} />
            </div>
        );
    }
}

@observer
export class CommentItem extends React.Component<{ commentItem: HouseComment; }, {}>
{
    UserStore: UserStore = UserStore.GetInstance();
    @observable likes: number = 0;
    @observable dislikes: number = 0;
    @observable liked: string = "";
    @observable showReplay: boolean = false;
    @observable replays: HouseComment[] = [];
    InitReplay = async () =>
    {
        const { commentItem } = this.props;
        this.replays = await (
            (await fetch(`${CONST_HOST}/GetHouseComment?hId=${commentItem.hId}&parentId=${commentItem.id}`)).json()
        ) as HouseComment[];
    };
    async componentDidMount()
    {
        await this.InitReplay();
    }
    render()
    {
        const { commentItem } = this.props;
        //汉化时间
        moment.defineLocale('zh-cn', {
            relativeTime: {
                future: '%s内',
                past: '%s前',
                s: '几秒',
                m: '1 分钟',
                mm: '%d 分钟',
                h: '1 小时',
                hh: '%d 小时',
                d: '1 天',
                dd: '%d 天',
                M: '1 个月',
                MM: '%d 个月',
                y: '1 年',
                yy: '%d 年',
            },
        });
        const actions = [
            <Tooltip title='赞'>
                <span onClick={() =>
                {
                    this.liked = 'like';
                    this.likes = 1;
                    this.dislikes = 0;
                }}>
                    {createElement(this.liked === 'like' ? LikeFilled : LikeOutlined)}
                    <span style={{ paddingLeft: "5px" }}>{this.likes}</span>
                </span>
            </Tooltip>,
            <Tooltip title='踩'>
                <span onClick={() =>
                {
                    this.liked = 'dislike';
                    this.likes = 0;
                    this.dislikes = 1;
                }}>
                    {createElement(this.liked === 'dislike' ? DislikeFilled : DislikeOutlined)}
                    <span style={{ paddingLeft: "5px" }}>{this.dislikes}</span>
                </span>
            </Tooltip>,
            <span
                style={{
                    color: !this.showReplay ? 'rgba(0, 0, 0, 0.45)' : '#1890ff',
                }}
                onClick={() =>
                {
                    this.showReplay = !this.showReplay;
                }}
            >回复
            </span>,
        ];
        return (
            <div className='CommentItem'>
                <Comment
                    actions={actions}
                    author={<span>{commentItem.author}</span>}
                    avatar={
                        <Avatar
                            size={46}
                            shape='circle'
                            src={commentItem.photo}
                        />
                    }
                    content={<p>{commentItem.content}</p>}
                    datetime={
                        <Tooltip title={moment(commentItem.commentDate).format('YYYY-MM-DD HH:mm:ss')}>
                            <span>{moment(commentItem.commentDate).fromNow()}</span>
                        </Tooltip>
                    }
                    children={
                        this.replays.map((c: HouseComment) =>
                        {
                            return (
                                <CommentItem key={c.id} commentItem={c} />
                            );
                        })
                    }
                />
                {this.showReplay && <CommentInput commentId={commentItem.id} />}
            </div>
        );
    }
}
