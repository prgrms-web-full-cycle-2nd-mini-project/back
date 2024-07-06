const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { StatusCodes } = require("http-status-codes");
const Trip = require("./models/trips.model");
const { CustomError } = require("./utils/CustomError");

dotenv.config();

function ensureAuthorization(req) {
  try {
    const token = req.cookies.token; // 쿠키에서 JWT 추출

    if (token) {
      const decodedJwt = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
      return decodedJwt;
    } else {
      throw new ReferenceError("JWT must be provided");
    }
  } catch (err) {
    return err;
  }
}

function validateToken(req, res, next) {
  const authorization = ensureAuthorization(req);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "로그인 세션이 만료되었습니다. 다시 로그인 하세요.",
    });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "잘못된 토큰입니다.",
    });
  } else if (authorization instanceof ReferenceError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "로그인이 필요한 기능입니다.",
    });
  }

  req.user = authorization; // 인증된 사용자 정보를 요청 객체에 저장
  return next();
}

function getLoginedId(req) {
  const authorization = ensureAuthorization(req);
  if (authorization && authorization.id) {
    return authorization.id;
  }

  return false;
}

async function accessAuthorization(req) {
  try {
    const { tripId } = req.params;
    const authorization = ensureAuthorization(req);

    const trip = await Trip.findById(tripId);
    if (!trip) {
      throw new CustomError("존재하지 않는 여행입니다.", StatusCodes.NOT_FOUND);
    }

    if (authorization.id !== trip.owner.toString()) {
      throw new CustomError("접근 권한이 없습니다.", StatusCodes.UNAUTHORIZED);
    }
  } catch (err) {
    throw new CustomError(
      err.message || "인증 실패",
      err.statusCode || StatusCodes.UNAUTHORIZED,
      err
    );
  }
}

module.exports = {
  ensureAuthorization,
  validateToken,
  getLoginedId,
  accessAuthorization,
};
