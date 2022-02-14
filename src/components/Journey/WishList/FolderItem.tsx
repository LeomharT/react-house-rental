import { CheckOutlined, DeleteOutlined, EditOutlined, RightOutlined } from '@ant-design/icons';
import { Card, Input, Popconfirm, Tooltip } from "antd";
import { observable } from "mobx";
import { observer } from "mobx-react";
import moment from "moment";
import { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import FolderEmpty from '../../../assets/img/Folder-Empty.gif';
import UserStore from "../../../redux/UserStore";

interface FolderItemProps extends RouteComponentProps
{
    FolderExhibit?: any[];
    folderID: string,
    folderName: string,
    createDate?: Date,
}
@observer
class FolderItem extends Component<FolderItemProps, {}>
{
    UserStore: UserStore = UserStore.GetInstance();
    @observable editing: boolean = false;
    render(): React.ReactNode
    {
        return (
            <Card className='FolderItem'
                actions={
                    [
                        <Tooltip title='进入文件夹'>
                            <RightOutlined key="ellipsis" onClick={e =>
                            {
                                this.props.history.push(`/UserCollection/${this.props.folderID}`);
                            }} />
                        </Tooltip>,
                        this.editing
                            ? <CheckOutlined key="edit" onClick={(e) =>
                            {
                                if (this.props.folderID === '0')
                                {
                                    e.preventDefault();
                                    return;
                                }
                                this.editing = !this.editing;
                            }} />
                            : <EditOutlined key="edit" onClick={(e) =>
                            {
                                if (this.props.folderID === '0')
                                {
                                    e.preventDefault();
                                    return;
                                }
                                this.editing = !this.editing;
                            }} />,
                        this.props.folderID === '0'
                            ? <DeleteOutlined style={{ color: "red" }} />
                            : <Popconfirm
                                title='确定要删除该文件夹吗'
                                okText="确定"
                                cancelText="取消"
                                icon={< DeleteOutlined style={{ color: 'red' }} />}
                                onConfirm={async (e) =>
                                {
                                    //@ts-ignore
                                    await this.UserStore.DeleteUserFolder(this.props.id, this.props.folderID);
                                }}
                            >

                                <DeleteOutlined style={{ color: "red" }} />
                            </Popconfirm>,
                    ]
                }
                cover={
                    <div className='FolderCover'>
                        {
                            this.props.FolderExhibit
                                ? <>
                                    <div className='FolderLeft'>
                                        <img alt='Empty' src={FolderEmpty} />
                                    </div>
                                    <div className='FolderRight'>
                                        <div>
                                            <img alt='Empty' src={FolderEmpty} />
                                        </div>
                                        <div>
                                            <img alt='Empty' src={FolderEmpty} />
                                        </div>
                                    </div>
                                </>
                                : <img alt='Empty' src={FolderEmpty} />
                        }

                    </div>
                }
            >
                <Card.Meta title={
                    this.editing ? <Input size='small' /> : this.props.folderName
                }
                    description={"创建于:" + (() =>
                    {
                        if (this.props.createDate)
                        {
                            return moment(this.props.createDate).format('YYYY年MM月DD日 hh时mm分ss秒');
                        } else
                        {
                            return moment(this.UserStore.authInfo?.userInfo?.createdAt as Date).format('YYYY年MM月DD日 hh时mm分ss秒');
                        }
                    })()
                    }
                />
            </Card>
        );
    }
};
export default withRouter(FolderItem);
