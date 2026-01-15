import { nextTick } from 'vue'
import { registerMicroApps, start } from 'qiankun'
import type { Router } from 'vue-router';

export default function initQianKun(router: Router) {
    router.isReady().then(async () => {
        console.log('\x1b[32m%s\x1b[0m', 29, `微应用转发`);
        await nextTick()
        registerMicroApps([
            {
                name: 'react-sub',
                entry: '//localhost:5174',
                container: '#subapp-container',
                activeRule: '/sub-react',
                props: {
                    routerBase: '/sub-react'
                }
            },
            {
                name: 'vue3-sub',
                entry: '//localhost:5175',
                container: '#subapp-container',
                activeRule: '/sub-vue3',
                // props: {
                //     routerBase: '/index'
                // }
            }
        ])

        start(
            // {
            //     prefetch: true,
            //     sandbox: {
            //         experimentalStyleIsolation: true
            //     }
            // }
        )
    })
}