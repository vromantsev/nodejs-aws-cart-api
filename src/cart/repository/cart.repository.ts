import { AppDataSource } from '../../data-source';
import { Cart, CartItem, CartStatuses } from '../models';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PutCartPayload } from '../../order/type';

@Injectable()
export class CartRepository {
  private cartRepository = AppDataSource.getRepository(Cart);

  async findByUserId(userId: string): Promise<Cart | null> {
    return await this.cartRepository.findOneBy({
      user_id: userId,
    });
  }

  async createByUserId(user_id: string): Promise<Cart | null> {
    const timestamp = Date.now();

    const userCart = {
      id: randomUUID(),
      user_id,
      created_at: timestamp,
      updated_at: timestamp,
      status: CartStatuses.OPEN,
      items: [],
    };

    return await this.cartRepository.save(userCart);
  }

  async findOrCreateByUserId(userId: string): Promise<Cart | null> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(
    userId: string,
    payload: PutCartPayload,
  ): Promise<Cart | null> {
    const userCart = await this.findOrCreateByUserId(userId);

    const index = userCart.items.findIndex(
      ({ product }) => product.id === payload.product.id,
    );

    const cartItem = new CartItem();
    cartItem.id = randomUUID();
    cartItem.cart = userCart;
    cartItem.product = payload.product;
    cartItem.count = payload.count;
    if (index === -1) {
      userCart.items.push(cartItem);
    } else if (payload.count === 0) {
      userCart.items.splice(index, 1);
    } else {
      userCart.items[index] = cartItem;
    }

    return userCart;
  }

  removeByUserId(userId): void {
    this.cartRepository.delete({ user_id: userId });
  }
}
