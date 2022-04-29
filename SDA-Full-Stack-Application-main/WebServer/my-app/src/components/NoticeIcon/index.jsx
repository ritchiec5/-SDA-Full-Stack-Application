import { useEffect, useState } from 'react';
import { Tag, message } from 'antd';
import { groupBy } from 'lodash';
import moment from 'moment';
import { useModel, useRequest } from 'umi';
import { getNotices } from '@/services/ant-design-pro/api';
import NoticeIcon from './NoticeIcon';
import styles from './index.less';

const baseURL = 'https://localhost:5001/DistanceVideo';



const getNoticeData = (notices) => {
  if (!notices || notices.length === 0 || !Array.isArray(notices)) {
    return {};
  }

  const newNotices = notices.map((notice) => {
    const newNotice = { ...notice };

    if (newNotice.datetime) {
      newNotice.datetime = moment(notice.datetime).locale('en').fromNow();
      console.log(newNotice.datetime);
    }

    if (newNotice.id) {
      newNotice.key = newNotice.id;
    }

    if (newNotice.extra && newNotice.status) {
      const color = {
        todo: '',
        processing: 'blue',
        urgent: 'red',
        doing: 'gold',
      }[newNotice.status];
      newNotice.extra = (
        <Tag
          color={color}
          style={{
            marginRight: 0,
          }}
        >
          {newNotice.extra}
        </Tag>
      );
    }

    return newNotice;
  });
  return groupBy(newNotices, 'type');
};

const getUnreadData = (noticeData) => {
  const unreadMsg = {};
  Object.keys(noticeData).forEach((key) => {
    const value = noticeData[key];

    if (!unreadMsg[key]) {
      unreadMsg[key] = 0;
    }

    if (Array.isArray(value)) {
      unreadMsg[key] = value.filter((item) => !item.read).length;
    }
  });
  return unreadMsg;
};

const NoticeIconView = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [notices, setNotices] = useState([]);
  const [myArray, updateMyArray] = useState([]);
  const [isInitialRender, setIsInitialRender] = useState(true);

  const fetchData = () => {
    fetch(baseURL)
      .then(result => result.json())
      .then(data => {
        let array = [];

        data.forEach(element => {
          if (element.notification){
            let object = {
              id: '',
              avatar: '',
              title: '',
              datetime: '',
              type: 'notification',
            };

            let dateCreated = moment(element.dateCreated, 'DD-MM-YYYY').locale('en').format('YYYY-MM-DD');
  
            object.id = element.id;
            object.avatar = 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png';
            object.title = element.video;
            object.datetime = dateCreated;
  
            array.push(object);
          }
      });
        updateMyArray((arr) => array);
      }).catch( err => { console.log(err)});
  }

  useEffect(() => {
    if (isInitialRender){
      setIsInitialRender(false); 
      fetchData();
    }
    setNotices(myArray);

  },[myArray]);

  const noticeData = getNoticeData(notices);
  const unreadMsg = getUnreadData(noticeData || {});

  const changeReadState = (id) => {
    setNotices(
      notices.map((item) => {
        const notice = { ...item };

        if (notice.id === id) {
          notice.read = true;
        }

        return notice;
      }),
    );
  };

  const clearReadState = (title, key) => {
    setNotices(
      notices.map((item) => {
        const notice = { ...item };

        if (notice.type === key) {
          notice.read = true;
        }

        return notice;
      }),
    );
    message.success(`${'Empty'} ${title}`);
  };

  const updatepost = (id) => {
    let completeID = baseURL + "/" + id;
    fetch(completeID, {
      method: 'PUT',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({
        notification: false
      }),
    }).then((response) => console.log(response));
  };

  return (
    <NoticeIcon
      className={styles.action}
      count={unreadMsg.notification}
      onItemClick={(item) => {
        changeReadState(item.id);
        updatepost(item.id);
      }}
      onClear={(title, key) => clearReadState(title, key)}
      loading={false}
      // clearText="Clear"
      // viewMoreText="View more"
      // onViewMore={() => message.info('Click on view more')}
      clearClose
    >
      <NoticeIcon.Tab
        tabKey="notification"
        count={unreadMsg.notification}
        list={noticeData.notification}
        title="Notification"
        emptyText="You are up-to-date"
        showViewMore
      />
    </NoticeIcon>
  );
};

export default NoticeIconView;
