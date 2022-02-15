import React from 'react';
import { Menu } from 'antd';


export class Channel extends React.Component {

    click = () => {
        this.props.onClick(this.props.id);
    }

    render() {
        return (
                <Menu.Item key={this.props.id}>{this.props.name} {this.props.participants}</Menu.Item>
        )
    }
}