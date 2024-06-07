import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma";
import { Item } from "../types";
import { BadRequestError } from "../Errors/badRequestError";
import { NotFoundError } from "../Errors/notFoundError";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import { generateReport } from "../util";

export const addItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, name, quantity, price } = req.body;

    const existingItem = await prisma.item.findFirst({
      where: {
        name,
      },
    });
    if (existingItem)
      throw new BadRequestError("Item with the same name already exists");
    const newItem = await prisma.item.create({
      data: {
        name,
        id,
        quantity,
        price,
      },
    });

    res.status(200).json({
      message: "success",
      item: newItem,
    });
  } catch (error) {
    next(error);
  }
};

export const editItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, name, quantity, price } = req.body;
    const existingItem = await prisma.item.findFirst({
      where: {
        id,
      },
    });
    if (!existingItem) throw new NotFoundError();
    const updatedItem = await prisma.item.update({
      where: {
        id,
      },
      data: {
        name: name ?? existingItem.name,
        quantity: quantity ?? existingItem.quantity,
        price: price ?? existingItem.price,
      },
    });
    res.status(201).json({
      message: "success",
      item: updatedItem,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const existingItem = await prisma.item.findFirst({
      where: {
        id,
      },
    });
    if (!existingItem) throw new NotFoundError();
    await prisma.item.delete({
      where: {
        id,
      },
    });
    res.status(200).json({
      message: "success",
      item: existingItem,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchAllItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pageIndex = parseInt(req.query.pageIndex as string, 10) || 0;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 5;

    const totalCount = await prisma.item.count();

    const items = await prisma.item.findMany({
      take: pageSize,
      skip: pageIndex * pageSize,
    });
    res.status(200).json({
      message: "success",
      items,
      rows: totalCount,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const item = await prisma.item.findFirst({
      where: {
        id,
      },
    });
    if (!item) throw new NotFoundError();
    res.status(200).json({
      message: "success",
      item,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchAllItemIds = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const itemIds = await prisma.item.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    res.status(200).json({
      message: "success",
      itemIds,
    });
  } catch (error) {
    next(error);
  }
};

export const prepareReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const items = await prisma.item.findMany({});
    if (!items.length) throw new NotFoundError();

    const pdf = new PDFDocument();
    const reportName = "report-" + new Date().getTime() + ".pdf";
    const reportsDir = path.join(__dirname, "..", "data", "reports");

    // Ensure the reports directory exists
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const filePath = path.join(reportsDir, reportName);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'inline;filename="' + reportName + '"'
    );

    pdf.pipe(fs.createWriteStream(filePath));
    pdf.pipe(res);
    generateReport(pdf, items);
    pdf.end();
  } catch (error) {
    next(error);
  }
};
