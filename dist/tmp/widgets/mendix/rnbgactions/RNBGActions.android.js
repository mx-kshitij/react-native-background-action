import { Component } from 'react';
import { Linking } from 'react-native';
import BackgroundJob from 'react-native-background-actions';

// Import libraries
const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));
let action;
// let taskStorageName: string;
BackgroundJob.on('expiration', () => {
    console.log('iOS: I am being closed!');
});
const taskRunOnce = async () => {
    await new Promise(async (_resolve) => {
        if (action === null || action === void 0 ? void 0 : action.canExecute) { // Check if the action is executable
            action.execute(); // Execute action
        }
    });
};
const taskRepeat = async (taskData) => {
    await new Promise(async (_resolve) => {
        // For loop with a delay
        const { delay } = taskData;
        for (let i = 0; BackgroundJob.isRunning(); i++) {
            if (action === null || action === void 0 ? void 0 : action.canExecute) { // Check if the action is executable
                action.execute(); // Execute action
                await BackgroundJob.updateNotification({ taskDesc: 'Running (' + i + ')' }); // Update notification that task is running 
            }
            await sleep(delay);
        }
    });
};
// Define options for background action
let options = {
    taskName: 'Example',
    taskTitle: 'ExampleTask title',
    taskDesc: 'ExampleTask desc',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'exampleScheme://chat/jane',
    parameters: {
        delay: 5000,
    },
};
// Define what to do when user clicks on notification
function handleOpenURL(evt) {
    console.log(evt.url);
    // do something with the url ??
}
Linking.addEventListener('url', handleOpenURL);
class RNBGActions extends Component {
    constructor(props) {
        super(props);
        // checkIfTaskTriggered = (taskName: string) => {
        //     const taskStorage = AsyncStorage.getItem(taskStorageName);
        //     console.log('Checking task : ' + taskName);
        //     if (taskStorage !== null) {
        //         const tasksRunning = taskStorage;
        //         console.log('Task storage found');
        //         console.log('Tasks running : ' + tasksRunning);
        //         if (tasksRunning.includes(taskName)) {
        //             console.log('Task ' + taskName + ' already running.');
        //             return true;
        //         }
        //         else {
        //             console.log('Task ' + taskName + ' not running.');
        //             return false;
        //         }
        //     }
        //     else {
        //         console.log('Task storage not found. Created');
        //         AsyncStorage.setItem(taskStorageName, "");
        //     }
        // };
        // setBackgroundTaskName = (taskName: string) => {
        //     const taskStorage = AsyncStorage.getItem(taskStorageName);
        //     console.log('Task storage not found. Created');
        //     let tasksRunning = taskStorage.toString();
        //     if (tasksRunning == "") {
        //         tasksRunning = taskName;
        //     }
        //     else {
        //         tasksRunning = tasksRunning + ';' + taskName;
        //     }
        //     console.log('Tasks running : ' + tasksRunning);
        //     AsyncStorage.setItem(taskStorageName, tasksRunning);
        // };
        this.initiateBackgroundTask = async () => {
            if (!this.props.runOnce) {
                options.parameters.delay = this.props.repeatInterval;
            }
            const isRunning = BackgroundJob.isRunning();
            try {
                console.log('Trying to start background service');
                const taskName = options.taskName;
                if (this.props.runOnce) {
                    if (!isRunning) {
                        await BackgroundJob.start(taskRunOnce, options);
                        console.log('Running process with identifier : "' + taskName + '".');
                    }
                    else {
                        console.log("Failed to start. Another process already running.");
                    }
                }
                else {
                    // if (!this.checkIfTaskTriggered(taskName)) {
                    if (!isRunning) {
                        await BackgroundJob.start(taskRepeat, options);
                        // this.setBackgroundTaskName(taskName);
                        console.log('Running process with identifier : "' + taskName + '".');
                    }
                    else {
                        // console.log('Duplicate task : Did not start. Another process with this identifier : "' + taskName + '" already running.');
                        console.log("Failed to start. Another process already running.");
                    }
                }
                console.log('Successful start!');
            }
            catch (e) {
                console.log('Error', e);
            }
        };
        this.stopBackgroundTask = async () => {
            console.log('Stopping background service');
            await BackgroundJob.stop();
        };
        this.initiateBackgroundTask = this.initiateBackgroundTask.bind(this);
        this.stopBackgroundTask = this.stopBackgroundTask.bind(this);
        action = this.props.action;
        // taskStorageName = "background-tasks-custom";
    }
    ;
    componentDidMount() {
        this.updateComponentOptions(); // Update options for background action
        this.initiateBackgroundTask(); // Start the background action
    }
    ;
    componentWillUnmount() {
        if (this.props.stopOnExit) { // Only stop the process if configured to do so
            this.stopBackgroundTask();
        }
    }
    ;
    updateComponentOptions() {
        options.taskName = this.props.taskName;
        options.taskTitle = this.props.taskTitle;
        options.taskDesc = this.props.taskDesc;
        options.linkingURI = this.props.linkingURI;
        options.color = this.props.notificationColor;
    }
    ;
    render() {
        return (null);
    }
    ;
}
// const isAvailable = (property: DynamicValue<any> | EditableValue<any>): boolean => {
//     return property && property.status === ValueStatus.Available && property.value;
// };
// export default function main(props: RNBGActionsProps<CustomStyle>) {
//     // this.initiateBackgroundTask = this.initiateBackgroundTask.bind(this);
//     // this.stopBackgroundTask = this.stopBackgroundTask.bind(this);
//     // action = this.props.action!;
//     // this.state = {
//     //     propsReady: false
//     // }
//     const [propsReady, setPropsReady] = useState(false);
//     const checkIfTaskTriggered = (taskName: string) => {
//         const taskStorage = AsyncStorage.getItem("background-tasks-custom");
//         if (taskStorage !== null) {
//             const tasksRunning = taskStorage.toString();
//             if (tasksRunning.includes(taskName)) {
//                 return true;
//             }
//             else {
//                 return false;
//             }
//         }
//         else {
//             AsyncStorage.setItem("background-tasks-custom", "");
//         }
//     }
//     const setBackgroundTaskName = (taskName: string) => {
//         const taskStorage = AsyncStorage.getItem("background-tasks-custom");
//         let tasksRunning = taskStorage.toString();
//         if (tasksRunning == "") {
//             tasksRunning = taskName;
//         }
//         else {
//             tasksRunning = tasksRunning + ';' + taskName;
//         }
//         AsyncStorage.setItem("background-tasks-custom", tasksRunning);
//     }
//     const initiateBackgroundTask = async () => {
//         console.log('taskName: ' + options.taskName);
//         console.log('taskTitle: ' + options.taskTitle);
//         console.log('taskDesc: ' + options.taskDesc);
//         console.log('linkingURI: ' + options.linkingURI);
//         console.log('color: ' + options.color);
//         if (!props.runOnce) {
//             options.parameters.delay = props.repeatInterval;
//         }
//         try {
//             console.log('Trying to start background service');
//             const taskName = options.taskName;
//             if (props.runOnce) {
//                 await BackgroundJob.start(taskRunOnce, options);
//                 console.log('Running process with identifier : "' + taskName + '".');
//             }
//             else {
//                 if (!checkIfTaskTriggered(taskName)) {
//                     await BackgroundJob.start(taskRepeat, options);
//                     setBackgroundTaskName(taskName);
//                     console.log('Running process with identifier : "' + taskName + '".');
//                 }
//                 else {
//                     console.log('Duplicate task : Did not start. Another process with this identifier : "' + taskName + '" already running.');
//                 }
//             }
//             console.log('Successful start!');
//         } catch (e) {
//             console.log('Error', e);
//         }
//     };
//     const updateComponentOptions = () => {
//         console.log('updating options');
//         options.taskName = isAvailable(props.taskName) ? props.taskName.value!.toString() : "_name";
//         options.taskTitle = isAvailable(props.taskTitle) ? props.taskTitle.value!.toString() : "_title";
//         options.taskDesc = isAvailable(props.taskDesc) ? props.taskDesc.value!.toString() : "_desc";
//         options.linkingURI = isAvailable(props.linkingURI) ? props.linkingURI.value!.toString() : "_uri";
//         options.color = isAvailable(props.notificationColor) ? props.notificationColor.value!.toString() : "#ffffff";
//     }
//     console.log('props : ' + propsReady);
//     if (
//         !propsReady &&
//         isAvailable(props.taskName) &&
//         isAvailable(props.taskTitle) &&
//         isAvailable(props.taskDesc) &&
//         isAvailable(props.linkingURI) &&
//         isAvailable(props.notificationColor)
//     ) {
//         console.log('props available');
//         setPropsReady(true);
//     }
//     console.log('component mount');
//     useEffect(() => {
//         console.log('using effect');
//         updateComponentOptions();
//         initiateBackgroundTask();
//     }, [propsReady]);
// }

export { RNBGActions };
