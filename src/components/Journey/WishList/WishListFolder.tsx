import { FolderAddOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import UserStore from '../../../redux/UserStore';
import HeadNavigate from '../../Common/HeadNavigate';
import AddNewFolder from './AddNewFolder';
import FolderItem from './FolderItem';

@observer
class WishListFolder extends Component<RouteComponentProps, {}>
{
    UserStore: UserStore = UserStore.GetInstance();
    @observable isOpenAddNewFolder: boolean = false;
    HandelOnClose = (status: boolean) => this.isOpenAddNewFolder = status;
    componentDidMount(): void
    {
        const uID = this.UserStore.GetCurrentUserId();
    }
    render()
    {
        return (
            <div className='WishListFolder'>
                <HeadNavigate />
                <h1 style={{ fontSize: "30px", fontWeight: "bold", padding: "0 80px", paddingTop: "20px" }}>
                    心愿单
                    <Tooltip title='添加文件夹' placement='bottom'>
                        <Button size='large' icon={<FolderAddOutlined />}
                            type='link'
                            style={{
                                marginLeft: '30px'
                            }}
                            onClick={e =>
                            {
                                this.isOpenAddNewFolder = !this.isOpenAddNewFolder;
                            }} />
                    </Tooltip>
                </h1>
                <div className='FolderList'>
                    <FolderItem folderID='0' folderName='默认合集' />
                </div>
                <AddNewFolder visible={this.isOpenAddNewFolder}
                    HandelOnClose={this.HandelOnClose}
                />
            </div>
        );
    }
}



export default withRouter(WishListFolder);
