import React from 'react';
import { Layout, Menu } from 'antd';
import 'antd/dist/antd.css';
import { SidebarData } from './SidebarData';
import { Link} from 'react-router-dom';
import '../App.css'


export default function Sidebar() {
  const { Sider } = Layout;
  const { SubMenu } = Menu;
  return (
    <Layout style={{ marginTop: '64px' }}>
      <Sider width={250} className="site-layout-background" style={{ position: 'fixed' }}>
        <Menu
          className='Scrollbar'
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
        >
         
          {SidebarData.map((item, index) => {
            return (
              <SubMenu icon={item.icon} title={item.title} key={index}>
                {
                  item.subNav.map((item1) => {
                    return (
                      <Menu.Item key={item1.path}>
                        {item1.title} 
                        <Link to={item1.path}/>
                      </Menu.Item>                     
                    );
                  })
                }
              </SubMenu>     
            )
          })} 
         
          
        </Menu>
      </Sider>
    </Layout>

  );
}
