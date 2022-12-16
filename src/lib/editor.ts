import { format } from "date-fns"
import { PDFDocument, PDFImage, PDFPage, PDFPageDrawImageOptions, PDFPageDrawTextOptions, StandardFonts } from "pdf-lib"
import { DataProps } from "../types"

class Editor {
    private path
    private doc:PDFDocument | null

    constructor(path:string) {
        this.path = path
        this.doc = null
    }

    async load() {
        const data = await fetch(this.path).then(res => res.arrayBuffer())
        try {
            this.doc = await PDFDocument.load(data)
        } catch (error) {
            console.error(error)
        }
    }

    addText(text: string, pageNum: number, options:PDFPageDrawTextOptions) {
        const page = this.doc?.getPage(pageNum)
        page?.drawText(text, options)
    }

    async addImage(uri:string, pageNum: number, options:PDFPageDrawImageOptions) {
        try {
            const jpgImageBytes = await fetch(uri).then((res) => res.arrayBuffer())
            const jpgImage = await this.doc?.embedJpg(jpgImageBytes)
            // const jpgDims = jpgImage?.scale(0.5)

            const page = this.doc?.getPage(pageNum)
            page?.drawImage(jpgImage as PDFImage, options)
        } catch (error) {
            console.error(error)
        }
    }

    async addImageFormData(data: string, pageNum: number, options:PDFPageDrawImageOptions) {
        try {
            const jpgImage = await this.doc?.embedJpg(data)
            const page = this.doc?.getPage(pageNum)
            page?.drawImage(jpgImage as PDFImage, options)
        } catch (error) {
            console.error(error)
        }
    }

    async edit(data:DataProps) {
        try {
            await this.load()

            const helveticaFont = await this.doc?.embedFont(StandardFonts.HelveticaBold)

            this.addText(data.name, 0, {
                x: 280,
                y: 562,
                size: 15,
                font: helveticaFont
            })

            const dt = new Date(data.date)
            this.addText(format(dt, "EEEE d LLLL yyyy") + ` Kickoff at ${format(dt, "HH:mm")}`, 0, {
                x: 168,
                y: 528,
                size: 14,
                font: helveticaFont
            })

            this.addText(data.membership, 0, {
                x: 215,
                y: 507,
                size: 12,
                font: helveticaFont
            })

            this.addText(data.area, 0, {
                x: 175,
                y: 484,
                size: 12,
                font: helveticaFont
            })

            this.addText(data.row, 0, {
                x: 285,
                y: 484,
                size: 12,
                font: helveticaFont
            })

            this.addText(data.seat, 0, {
                x: 383,
                y: 484,
                size: 12,
                font: helveticaFont
            })

            const page = this.doc?.getPage(0) as PDFPage

            const size = 135
            this.addImageFormData(data.qr, 0, {
                x: page.getWidth() / 2 - size / 2,
                y: 630,
                width: size,
                height: size
            })

            const s_size = 80
            this.addImageFormData(data.qr, 0, {
                x: page.getWidth() - s_size,
                y: 163,
                width: s_size,
                height: s_size
            })

            return await this.doc?.save()
        } catch (error) {
            console.error(error)
        }
    }
}

export default Editor