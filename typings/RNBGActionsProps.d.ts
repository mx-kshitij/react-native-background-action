/**
 * This file was generated from RNBGActions.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ActionValue } from "mendix";

export interface RNBGActionsProps<Style> {
    name: string;
    style: Style[];
    taskName: string;
    taskTitle: string;
    taskDesc: string;
    linkingURI: string;
    runOnce: boolean;
    repeatInterval: number;
    stopOnExit: boolean;
    action?: ActionValue;
    notificationColor: string;
}

export interface RNBGActionsPreviewProps {
    class: string;
    style: string;
    taskName: string;
    taskTitle: string;
    taskDesc: string;
    linkingURI: string;
    runOnce: boolean;
    repeatInterval: number | null;
    stopOnExit: boolean;
    action: {} | null;
    notificationColor: string;
}
