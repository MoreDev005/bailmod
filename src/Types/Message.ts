import { AxiosRequestConfig } from 'axios'
import type { Readable } from 'stream'
import type { URL } from 'url'
import { proto } from '../../WAProto'
import { MEDIA_HKDF_KEY_MAPPING } from '../Defaults'
import { BinaryNode } from '../WABinary'
import type { GroupMetadata } from './GroupMetadata'
import { CacheStore } from './Socket'
import { ILogger } from '../Utils/logger'

// export the WAMessage Prototypes
export { proto as WAProto }
export type WAMessage = proto.IWebMessageInfo & { key: WAMessageKey }
export type WAMessageContent = proto.IMessage
export type WAContactMessage = proto.Message.IContactMessage
export type WAContactsArrayMessage = proto.Message.IContactsArrayMessage
export type WAMessageKey = proto.IMessageKey & { senderPn?: string, senderLid?: string, participantLid?: string, participantPn?: string, server_id?: string, isViewOnce?: boolean }
export type WATextMessage = proto.Message.IExtendedTextMessage
export type WAContextInfo = proto.IContextInfo
export type WALocationMessage = proto.Message.ILocationMessage
export type WAGenericMediaMessage = proto.Message.IVideoMessage | proto.Message.IImageMessage | proto.Message.IAudioMessage | proto.Message.IDocumentMessage | proto.Message.IStickerMessage
export const WAMessageStubType = proto.WebMessageInfo.StubType
export const WAMessageStatus = proto.WebMessageInfo.Status
export type WAMediaPayloadURL = { url: URL | string }
export type WAMediaPayloadStream = { stream: Readable }
export type WAMediaUpload = Buffer | WAMediaPayloadStream | WAMediaPayloadURL
/** Set of message types that are supported by the library */
export type MessageType = keyof proto.Message

export type DownloadableMessage = { mediaKey?: Uint8Array | null, directPath?: string | null, url?: string | null }

export type MessageReceiptType = 'read' | 'read-self' | 'hist_sync' | 'peer_msg' | 'sender' | 'inactive' | 'played' | undefined

export type MediaConnInfo = {
    auth: string
    ttl: number
    hosts: { hostname: string, maxContentLengthBytes: number }[]
    fetchDate: Date
}

export interface WAUrlInfo {
    'canonical-url': string
    'matched-text': string
    title: string
    description?: string
    jpegThumbnail?: Buffer
    highQualityThumbnail?: proto.Message.IImageMessage
    originalThumbnailUrl?: string
}

// types to generate WA messages
type Mentionable = {
    /** list of jids that are mentioned in the accompanying text */
    mentions?: string[]
}
type Contextable = {
    /** add contextInfo to the message */
    contextInfo?: proto.IContextInfo
}
type ViewOnce = {
    viewOnce?: boolean
}

type Buttonable = {
    /** add buttons to the message  */
    buttons?: proto.Message.ButtonsMessage.IButton[]
}
type Templatable = {
    /** add buttons to the message (conflicts with normal buttons)*/
    templateButtons?: proto.IHydratedTemplateButton[]

    footer?: string
}
type Interactiveable = {
    /** add buttons to the message  */
    interactiveButtons?: proto.Message.InteractiveMessage.NativeFlowMessage.NativeFlowButton[]
    title?: string
    subtitle?: string
    media?: boolean
}
type Shopable = {
    shop?: proto.Message.InteractiveMessage.ShopMessage.Surface
    id?: string
    title?: string
    subtitle?: string
    media?: boolean
}
type Cardsable = {
    cards?: string[]
    subtitle?: string
}
type Editable = {
    edit?: WAMessageKey
}
type Listable = {
    /** Sections of the List */
    sections?: proto.Message.ListMessage.ISection[]

    /** Title of a List Message only */
    title?: string

    /** Text of the button on the list (required) */
    buttonText?: string
    
    /** ListType of a List Message only */
    listType?: proto.Message.ListMessage.ListType
}
type WithDimensions = {
    width?: number
    height?: number
}

export type PollMessageOptions = {
    name: string
    selectableCount?: number
    values: string[]
    /** 32 byte message secret to encrypt poll selections */
    messageSecret?: Uint8Array
    toAnnouncementGroup?: boolean
}

type SharePhoneNumber = {
    sharePhoneNumber: boolean
}

type RequestPhoneNumber = {
    requestPhoneNumber: boolean
}

export type MediaType = keyof typeof MEDIA_HKDF_KEY_MAPPING
export type AnyMediaMessageContent = (
    ({
        image: WAMediaUpload
        caption?: string
        jpegThumbnail?: string
    } & Mentionable & Contextable & Buttonable & Templatable & Interactiveable & Shopable & Cardsable & WithDimensions)
    | ({
        video: WAMediaUpload
        caption?: string
        gifPlayback?: boolean
        jpegThumbnail?: string
        /** if set to true, will send as a `video note` */
        ptv?: boolean
    } & Mentionable & Contextable & Buttonable & Templatable & Interactiveable & Shopable & Cardsable & WithDimensions)
    | {
        audio: WAMediaUpload
        /** if set to true, will send as a `voice note` */
        ptt?: boolean
        /** optionally tell the duration of the audio */
        seconds?: number
    }
    | ({
        sticker: WAMediaUpload
        isAnimated?: boolean
    } & WithDimensions) | ({
        document: WAMediaUpload
        mimetype: string
        fileName?: string
        caption?: string
    } & Contextable & Buttonable & Templatable & Interactiveable & Shopable & Cardsable))
    & { mimetype?: string } & Editable

export type ButtonReplyInfo = {
    displayText: string
    id: string
    index: number
}

export type GroupInviteInfo = {
    inviteCode: string
    inviteExpiration: number
    text: string
    jid: string
    subject: string
}

export type CallCreationInfo = {
    time?: number
    title?: string
    type?: number
}

export type AdminInviteInfo = {
    inviteExpiration: number
    text: string
    jid: string
    subject: string
    thumbnail: Buffer
}

export type PaymentInviteInfo = {
    type?: number
    expiry?: number
}

export type RequestPaymentInfo = {
    expiry: number
    amount: number
    currency: string
    from: string
    note?: string
    sticker?: WAMediaUpload
    background: string
    /** add contextInfo to the message */
    contextInfo?: proto.IContextInfo
}

export type EventsInfo = {
    isCanceled?: boolean
    name: string
    description: string
    joinLink?: string
    startTime?: number
    messageSecret?: Uint8Array
}

export type OrderInfo = {
    id: number
    thumbnail: string
    itemCount: number
    status: number
    surface: number
    title: string
    text: string
    seller: string
    token: string
    amount: number
    currency: string
}

export type WASendableProduct = Omit<proto.Message.ProductMessage.IProductSnapshot, 'productImage'> & {
    productImage: WAMediaUpload
}

export type AlbumMedia =
    | { 
        image: WAMediaUpload
        caption?: string
    }
    | { 
        video: WAMediaUpload
        caption?: string
        gifPlayback?: boolean
    }

export type AnyRegularMessageContent = (
    ({
        text: string
        linkPreview?: WAUrlInfo | null
    }
    & Mentionable & Contextable & Buttonable & Templatable & Interactiveable & Shopable & Cardsable & Listable & Editable)
    | AnyMediaMessageContent
    | ({
        poll: PollMessageOptions
    } & Mentionable & Contextable & Buttonable & Templatable & Editable)
    | {
        contacts: {
            displayName?: string
            contacts: proto.Message.IContactMessage[]
        }
    }
    | {
        location: WALocationMessage
    }
    | { react: proto.Message.IReactionMessage }
    | {
        buttonReply: ButtonReplyInfo
        type: 'template' | 'plain'
    }
    | {
        groupInvite: GroupInviteInfo
    }
    | {
        listReply: Omit<proto.Message.IListResponseMessage, 'contextInfo'>
    }
    | {
        pin: WAMessageKey
        type: proto.PinInChat.Type
        /**
         * 24 hours, 7 days, 30 days
         */
        time?: 86400 | 604800 | 2592000
    }
    | {
        keep: WAMessageKey
        type: number
        /**
         * 24 hours, 7 days, 90 days
         */
        time?: 86400 | 604800 | 7776000
    }
    | {
        paymentInvite: PaymentInviteInfo
    }
    | {
        requestPayment: RequestPaymentInfo
    }
    | {
        event: EventsInfo
    }
    | {
        order: OrderInfo
    }
    | {
        call: CallCreationInfo
    } 
    | {
        inviteAdmin: AdminInviteInfo
    }
    | {
        listReply: Omit<proto.Message.IListResponseMessage, 'contextInfo'>
    }
    | ({
        product: WASendableProduct
        businessOwnerJid?: string
        body?: string
        footer?: string
    } & Mentionable & Contextable & Interactiveable & Shopable & Cardsable & WithDimensions)
    | SharePhoneNumber | RequestPhoneNumber
    | ({
        album: AlbumMedia[]
        caption?: string
    } & Mentionable & Contextable & Editable)
) & ViewOnce

export type AnyMessageContent = AnyRegularMessageContent | {
    forward: WAMessage
    force?: boolean
} | {
    /** Delete your message or anyone's message in a group (admin required) */
    delete: WAMessageKey
} | {
    disappearingMessagesInChat: boolean | number
}

export type GroupMetadataParticipants = Pick<GroupMetadata, 'participants'>

type MinimalRelayOptions = {
    /** override the message ID with a custom provided string */
    messageId?: string
    /** should we use group metadata cache, or fetch afresh from the server; default assumed to be "true" */
    useCachedGroupMetadata?: boolean
}

export type MessageRelayOptions = MinimalRelayOptions & {
    /** only send to a specific participant; used when a message decryption fails for a single user */
    participant?: { jid: string, count: number }
    /** additional attributes to add to the WA binary node */
    additionalAttributes?: { [_: string]: string }
    additionalNodes?: BinaryNode[]
    /** should we use the devices cache, or fetch afresh from the server; default assumed to be "true" */
    useUserDevicesCache?: boolean
    /** jid list of participants for status@broadcast */
    statusJidList?: string[]
    newsletter?: boolean
}

export type MiscMessageGenerationOptions = MinimalRelayOptions & {
    /** optional, if you want to manually set the timestamp of the message */
    timestamp?: Date
    /** the message you want to quote */
    quoted?: WAMessage
    /** disappearing messages settings */
    ephemeralExpiration?: number | string
    /** timeout for media upload to WA server */
    mediaUploadTimeoutMs?: number
    /** jid list of participants for status@broadcast */
    statusJidList?: string[]
    /** backgroundcolor for status */
    backgroundColor?: string
    /** font type for status */
    font?: number
    /** if it is broadcast */
    broadcast?: boolean
    newsletter?: boolean
    additionalNodes?: BinaryNode[];
}
export type MessageGenerationOptionsFromContent = MiscMessageGenerationOptions & {
    userJid: string
}

export type WAMediaUploadFunctionOpts = { fileEncSha256B64: string, mediaType: MediaType, newsletter?: boolean, timeoutMs?: number }

export type WAMediaUploadFunction = (readStream: Readable | Buffer, opts: WAMediaUploadFunctionOpts) => Promise<{ mediaUrl: string, directPath: string, handle?: string }>

export type MediaGenerationOptions = {
    logger?: ILogger
    mediaTypeOverride?: MediaType
    upload: WAMediaUploadFunction
    /** cache media so it does not have to be uploaded again */
    mediaCache?: CacheStore

    mediaUploadTimeoutMs?: number

    options?: AxiosRequestConfig

    backgroundColor?: string

    font?: number
    
    /** The message is for newsletter? */
    newsletter?: boolean
}
export type MessageContentGenerationOptions = MediaGenerationOptions & {
    getUrlInfo?: (text: string) => Promise<WAUrlInfo | undefined>
    getProfilePicUrl?: (jid: string, type: 'image' | 'preview') => Promise<string | undefined>
}
export type MessageGenerationOptions = MessageContentGenerationOptions & MessageGenerationOptionsFromContent

/**
 * Type of message upsert
 * 1. notify => notify the user, this message was just received
 * 2. append => append the message to the chat history, no notification required
 */
export type MessageUpsertType = 'append' | 'notify'

export type MessageUserReceipt = proto.IUserReceipt

export type WAMessageUpdate = { update: Partial<WAMessage>, key: proto.IMessageKey }

export type WAMessageCursor = { before: WAMessageKey | undefined } | { after: WAMessageKey | undefined }

export type MessageUserReceiptUpdate = { key: proto.IMessageKey, receipt: MessageUserReceipt }

export type MediaDecryptionKeyInfo = {
    iv: Buffer
    cipherKey: Buffer
    macKey?: Buffer
}

export type MinimalMessage = Pick<proto.IWebMessageInfo, 'key' | 'messageTimestamp'>
