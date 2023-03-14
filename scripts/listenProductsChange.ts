import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import type { ClientModule } from '@docusaurus/types';

const module: ClientModule = {
  onRouteUpdate({ location }) {
    if (ExecutionEnvironment.canUseDOM) {
      // NOTE: 默认选项隐藏（custom.css），当进入对应路由后再显示。
      if (location.pathname.startsWith('/enterprise')) {
        setTimeout(() => {
          const whitepaperItem = <HTMLElement>document.querySelector(".navbar-enterprise-whitepaper")
          if (whitepaperItem) {
            whitepaperItem.style.display = "inline-block";
          }
        }, 50)
      }
    }
  }
};
export default module;