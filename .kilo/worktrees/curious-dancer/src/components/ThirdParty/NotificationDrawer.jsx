import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { userApi } from '../../services/apiFunctions';

const NotificationDrawer = ({ open, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await userApi.notifications.getAllNotifications({
        onSuccess: (res) => {
          const fetchedNotifications = res.data || [];
          setNotifications(fetchedNotifications);

          const unreadNotificationsCount = fetchedNotifications.filter(
            (notification) => notification.status !== 'read'
          ).length;
          setUnreadCount(unreadNotificationsCount);
        },
        onError: (err) => {
          console.error('Failed to fetch notifications', err);
        },
      });
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await userApi.notifications.markAllAsRead({
        onSuccess: () => {
          setNotifications(notifications.map((n) => ({ ...n, status: 'read' })));
          setUnreadCount(0);
        },
        onError: (err) => {
          console.error('Failed to mark notifications as read', err);
        },
      });
    } catch (err) {
      console.error('Failed to mark notifications as read', err);
    }
  };

  const groupByTime = (list = []) => {
    const now = new Date();
    return {
      'Last 7 days': list.filter(
        (n) => new Date(n.createdAt) >= new Date(now - 7 * 24 * 60 * 60 * 1000)
      ),
      'Previous 30 days': list.filter(
        (n) =>
          new Date(n.createdAt) < new Date(now - 7 * 24 * 60 * 60 * 1000) &&
          new Date(n.createdAt) >= new Date(now - 30 * 24 * 60 * 60 * 1000)
      ),
      'Last 90 days': list.filter(
        (n) =>
          new Date(n.createdAt) < new Date(now - 30 * 24 * 60 * 60 * 1000) &&
          new Date(n.createdAt) >= new Date(now - 90 * 24 * 60 * 60 * 1000)
      ),
    };
  };

  const grouped = groupByTime(notifications);

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:max-w-md bg-white shadow-lg z-50 transform transition-transform duration-300 ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <div className="flex items-center gap-4">
          {notifications?.length > 0 && (
            <button onClick={markAllAsRead} className="text-sm text-blue-500 hover:underline">
              Mark all as read
            </button>
          )}
          <Icon icon="mdi:close" className="text-xl cursor-pointer" onClick={onClose} />
        </div>
      </div>
      {/* Tabs */}
      <div className="flex items-center justify-between px-4 py-2 text-sm font-medium border-b">
        <div className="flex gap-4">
          <button className="pb-1 text-black border-b-2 border-black">All</button>
          <button className="text-gray-400">Unread ({unreadCount})</button>
        </div>
      </div>
      {/* Notification list */}
      <div className="overflow-y-auto h-[calc(100%-112px)] p-4">
        {loading ? (
          <p className="text-sm text-center text-gray-500">Loading...</p>
        ) : notifications.length === 0 ? (
          <p className="text-sm text-center text-gray-500">No notifications</p>
        ) : (
          Object?.entries(grouped)?.map(([section, items]) =>
            items?.length > 0 ? (
              <div key={section} className="mb-6">
                <h3 className="mb-3 text-sm font-semibold text-gray-500">{section}</h3>
                {items?.map((n, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 items-start p-4 rounded-xl mb-3 transition ${
                      n.status === 'read' ? 'bg-gray-100' : 'bg-green-50'
                    }`}
                  >
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-green-900 rounded-full">
                      <Icon icon="lets-icons:message-light" className="text-xl text-yellow-400" />
                    </div>

                    <div className="flex flex-col flex-grow">
                      <span className="text-sm font-semibold text-gray-800 break-words">
                        {n.title || 'Notification'}
                      </span>
                      <span className="mt-1 text-sm text-gray-600 break-words">{n.content}</span>
                      {/* <p className="mt-2 text-xs text-gray-400">
                        {new Date(n.createdAt).toLocaleString()}
                      </p> */}
                    </div>
                  </div>
                ))}
              </div>
            ) : null
          )
        )}
      </div>
    </div>
  );
};

export default NotificationDrawer;
