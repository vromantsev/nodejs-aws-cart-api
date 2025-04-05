import { Injectable } from '@nestjs/common';
import { Cart } from '../models';
import { PutCartPayload } from 'src/order/type';
import { CartRepository } from '../repository';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  async findByUserId(userId: string): Promise<Cart | null> {
    return await this.cartRepository.findByUserId(userId);
  }

  async createByUserId(user_id: string): Promise<Cart | null> {
    return await this.cartRepository.createByUserId(user_id);
  }

  async findOrCreateByUserId(userId: string): Promise<Cart | null> {
    return await this.cartRepository.findOrCreateByUserId(userId);
  }

  async updateByUserId(
    userId: string,
    payload: PutCartPayload,
  ): Promise<Cart | null> {
    return await this.cartRepository.updateByUserId(userId, payload);
  }

  removeByUserId(userId): void {
    this.cartRepository.removeByUserId(userId);
  }
}
