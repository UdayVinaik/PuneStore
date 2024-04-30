import { Linking } from "react-native";
import qs from 'qs';

export const sendEmail = async (to: string = 'vinaik.business@gmail.com', subject: string, body: string, options: any= {}) => {
    try {
        const {cc, bcc} = options;
        let url = `mailto:${to}`;

        const query = qs.stringify({
            subject: subject,
            body: body,
            cc: cc,
            bcc: bcc
        });

        if(query.length) {
            url+= `?${query}`;
        }

        const canOpen = Linking.canOpenURL(url);

        if(!canOpen) {
            throw new Error('Provided URL can not be handled');
        }

        return Linking.openURL(url);
    } catch(error) {
        console.log('Error ==', error);
    }
}