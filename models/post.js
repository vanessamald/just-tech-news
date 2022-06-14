const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Post model
class Post extends Model {
  static upvote(body, models) {
    return models.Vote.create({
      user_id: body.user_id,
      post_id: body.post_id
    }).then(() => {
      return Post.findOne({
        where: {
          id: body.post_id
        },
        attributes: [
          'id',
          'post_url',
          'title',
          'created_at',
          [
            sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
            'vote_count'
          ]
        ]
      });
    });
  }
}

// create fields/columns for Post model
Post.init(
    {
    // defines the post schema
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      // define the title column as a String value
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      // also defined as a String
      post_url: {
        type: DataTypes.STRING,
        allowNull: false,
        // validation for schema definition
        validate: {
          isURL: true
        }
      },
      user_id: {
        type: DataTypes.INTEGER,
        // the references property establishes the relationship between the post and the user
        // by creating a reference to the User model(specifically the id column define by the key)
        references: {
          model: 'user',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      modelName: 'post'
    
    }

  );
  module.exports = Post;
