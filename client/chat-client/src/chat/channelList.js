import React from 'react';
import { Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';

export class ChannelList extends React.Component {

    handleClick = id => {
        this.props.onSelectChannel(id);
    }

    onhandleClick = e =>{
        this.props.onSelectChannel(parseInt(e.key));
    }

    render() {

        let list = <div className="no-content-message">There is no channels to show</div>;
        if (this.props.channels && this.props.channels.map) {
            list = this.props.channels.map(c => <Menu.Item key={c.id}>{c.name + "     "+c.participants} </Menu.Item>);
        }
        return (
            <div className='channel-list'>
                
                <Menu
                    onClick={this.onhandleClick}
                    style={{ width: 256 }}
                    mode="inline"
                    defaultOpenKeys={["channels"]}
                >
                    <SubMenu key="channels" title="Channels">
                        {list}
                    </SubMenu>
                </Menu>
            </div>);
    }

}