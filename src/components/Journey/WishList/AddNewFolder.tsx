import { Form, FormInstance, Input, message, Modal } from 'antd';
import React, { Component, createRef, RefObject } from 'react';
import UserStore from '../../../redux/UserStore';
import { CONST_HOST, DataRowState } from '../../Common/VariableGlobal';

interface AddNewFolderProps
{
    visible: boolean;
    HandelOnClose: (status: boolean) => void;
}
export default class AddNewFolder extends Component<AddNewFolderProps, { loading: boolean; }>
{
    constructor(props: AddNewFolderProps)
    {
        super(props);
        this.state = {
            loading: false,
        };
    }
    UserStore: UserStore = UserStore.GetInstance();
    formRef: RefObject<FormInstance> = createRef<FormInstance>();
    CreateNewFolder = async (value: { folderName: string; }): Promise<void> =>
    {
        this.setState({ loading: true });

        let res = await (fetch(`${CONST_HOST}/CreateNewUserCollectionFolder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(Object.assign(value, {
                uId: this.UserStore.GetCurrentUserId()
            }))
        }));

        if ((await res.json() as DataRowState).affectedRows === 1)
        {
            message.success("创建成功");
        } else
        {
            message.error('创建失败');
        }
        this.setState({ loading: false });
        this.UserStore.InitUserFolders();
        this.props.HandelOnClose(false);
    };
    render()
    {
        return (
            <Modal {...this.props}
                confirmLoading={this.state.loading}
                onCancel={e => this.props.HandelOnClose(false)}
                cancelText='取消' okText='确定'
                title='新建文件夹'
                onOk={e => this.formRef.current!.submit()}
            >
                <Form ref={this.formRef} onFinish={this.CreateNewFolder}>
                    <Form.Item
                        label={"文件夹名称"}
                        name="folderName"
                        rules={[{ required: true, message: "请输入文件夹名称" }]}
                    >
                        <Input size='large' placeholder='请输入文件夹名称' />
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}
