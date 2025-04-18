import { useEffect } from 'react';

const DingtalkAuth = ({ onReady }) => {
  useEffect(() => {
    const initDingTalk = async () => {
      try {
        // 获取当前页面URL（去除hash部分）
        const url = encodeURIComponent(window.location.href.split('#')[0]);
        // 从后端获取配置
        const res = await fetch(`/proxy/generator/dingtalk/getDingSignConfig?url=${url}`);
        const config = await res.json();

        // 动态加载钉钉JSAPI
        const script = document.createElement('script');
        script.src = 'https://g.alicdn.com/dingding/dingtalk-jsapi/2.10.3/dingtalk.open.js';

        // 在调用dd.config前添加环境检测
        if (!navigator.userAgent.includes('DingTalk')) {
          console.error('请通过钉钉客户端访问');
          window.location.href = '/404';
          return;
        }

        script.onload = () => {
          // if (typeof window.dd === 'undefined') {
          //   console.error('钉钉JSAPI未加载成功，请通过钉钉客户端访问。');
          //   return;
          // }
          window.dd.config({
            agentId: config.agentId,
            corpId: config.corpId,
            timeStamp: config.timestamp,
            nonceStr: config.nonceStr,
            signature: config.signature,
            jsApiList: ['runtime.info', 'biz.contact.complexPicker', 'device.base.getPhoneInfo'] // 按需填写
          });

          window.dd.ready(() => {
            console.log('钉钉API初始化完成');
          });

          window.dd.error(err => {
            console.error('钉钉初始化错误:', err);

          });
        };
        document.body.appendChild(script);
      } catch (error) {
        console.error('初始化失败:', error);
      }
    };

    initDingTalk();
  }, [onReady]);

  return null; // 这个组件不需要渲染内容
};

export default DingtalkAuth;