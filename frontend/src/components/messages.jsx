import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Spinner } from 'react-bootstrap';

import _ from 'lodash';

import { getUserInfo } from '../slices/userSlice';
import {
  messagesSelectors,
  fetchMessages,
} from '../slices/messagesSlice';
import { channelsSelectors } from '../slices/channelSlice';
import {
  getPressedChannelId,
  getPressedAddChannel,
  getPressedRemoveChannel,
  getPressedRenameChannel,
} from '../slices/uiSlice';
import MessageForm from './messageForm';

const Messages = () => {
  const { t } = useTranslation();
  const messagesList = useSelector(messagesSelectors.selectAll);
  const currentChannelId = useSelector(getPressedChannelId);
  const isPressedAddChannel = useSelector(getPressedAddChannel);
  const isPressedRemoveChannel = useSelector(getPressedRemoveChannel);
  const isPressedRenameChannel = useSelector(getPressedRenameChannel);
  const currentChannel = useSelector((state) => channelsSelectors
    .selectById(state, currentChannelId));
  const currentChannelName = currentChannel?.name;
  const isLoading = useSelector((state) => state.messages.loadingStatus);
  const channelMessagesList = messagesList
    .filter((message) => +message.channelId === currentChannelId);
  const messagesCount = _.size(channelMessagesList);
  const [currentToken, currentUser] = useSelector(getUserInfo);
  const dispatch = useDispatch();

  const endMessageRef = useRef(null);
  useEffect(() => {
    if (endMessageRef.current) {
      endMessageRef.current.scrollTop = endMessageRef.current.scrollHeight;
    }
  }, [currentChannel, channelMessagesList]);
  useEffect(() => {
    dispatch(fetchMessages(currentToken));
  }, [dispatch, currentToken]);

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>
              #&nbsp;
              {currentChannelName}
            </b>
          </p>
          <span className="text-muted">{t('chat.messageCount', { count: messagesCount })}</span>
        </div>
        <div
          id="messages-box"
          className="chat-messages overflow-auto px-5"
          ref={endMessageRef}
        >
          {isLoading === 'loading' ? (
            <div
              className="d-flex justify-content-center align-items-center w-100"
              style={{ flexGrow: 1 }}
            >
              <Spinner variant="secondary" animation="border" role="status">
                <span className="visually-hidden">{t('loading')}</span>
              </Spinner>
            </div>
          ) : (
            channelMessagesList.map(({ body, username, id }) => (
              <div key={id} className="text-break mb-2">
                <b>{username}</b>
                :&nbsp;
                {body}
              </div>
            ))
          )}
        </div>
        <div className="mt-auto px-5 py-3">
          <MessageForm
            currentToken={currentToken}
            currentChannelId={currentChannelId}
            currentUser={currentUser}
            channelMessagesList={channelMessagesList}
            isPressedAddChannel={isPressedAddChannel}
            isPressedRemoveChannel={isPressedRemoveChannel}
            isPressedRenameChannel={isPressedRenameChannel}
            t={t}
          />
        </div>
      </div>
    </div>
  );
};

export default Messages;